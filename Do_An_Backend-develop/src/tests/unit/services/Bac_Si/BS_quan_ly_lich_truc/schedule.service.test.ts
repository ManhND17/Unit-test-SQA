import scheduleService from '@src/services/schedule.service';
import * as scheduleDao from '@src/daos/schedule.dao';
import appointmentDao from '@src/daos/appointment.dao';
import { createQueryBuilder } from '@src/helpers/queryBuilder';
import { CustomError, ErrorType } from '@src/core/Error';

// Mock các dependencies
jest.mock('@src/daos/schedule.dao');
jest.mock('@src/daos/appointment.dao');
jest.mock('@src/helpers/queryBuilder');
jest.mock('@src/config/prisma');

describe('Schedule Service Unit Tests (Doctor Schedule Management)', () => {
    const scheduleId = 'sch-1';
    const userId = 'user-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // =========================================================================
    // 1. createScheduleService
    // =========================================================================
    describe('createScheduleService', () => {
        const validStaff = { id: 'staff-1', userId };
        
        beforeEach(() => {
            const mockQueryBuilder = { findUnique: jest.fn().mockResolvedValue(validStaff) };
            (createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
        });

        it('TC_BS_LT_SV_001 - should create schedule successfully with valid data', async () => {
            (scheduleDao.createSchedule as jest.Mock).mockResolvedValue({ id: scheduleId });

            const result = await scheduleService.createScheduleService({ 
                staffId: userId, 
                date: '2025-01-01',
                startTime: '2025-01-01T08:00:00Z',
                endTime: '2025-01-01T17:00:00Z'
            } as any);

            expect(result.id).toBe(scheduleId);
        });

        it('TC_BS_LT_SV_002 - should fail when endTime <= startTime', async () => {
            await expect(scheduleService.createScheduleService({ 
                staffId: userId, 
                startTime: '2025-01-01T10:00:00Z', 
                endTime: '2025-01-01T09:00:00Z' 
            } as any))
            .rejects.toThrow();
        });

        it('TC_BS_LT_SV_003 - should fail if duration is less than 5 hours', async () => {
            await expect(scheduleService.createScheduleService({ 
                staffId: userId, 
                startTime: '2025-01-01T08:00:00Z', 
                endTime: '2025-01-01T10:00:00Z' 
            } as any))
            .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });

        it('TC_BS_LT_SV_004 - should fail if schedule is in the past', async () => {
            const pastDate = '2000-01-01T10:00:00Z';
            await expect(scheduleService.createScheduleService({ 
                staffId: userId, 
                date: pastDate, 
                startTime: pastDate, 
                endTime: '2000-01-01T16:00:00Z' 
            } as any))
            .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });

        it('TC_BS_LT_SV_005 - should fail if schedule overlaps with another shift', async () => {
            (scheduleDao.getListSchedules as jest.Mock).mockResolvedValue({
                data: [{ startTime: new Date('2025-01-01T07:00:00Z'), endTime: new Date('2025-01-01T13:00:00Z') }]
            });

            await expect(scheduleService.createScheduleService({ 
                staffId: userId, 
                startTime: '2025-01-01T09:00:00Z',
                endTime: '2025-01-01T19:00:00Z' 
            } as any))
            .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });

        it('TC_BS_LT_SV_006 - should succeed for overnight shift (19:00 - 07:00)', async () => {
            (scheduleDao.createSchedule as jest.Mock).mockResolvedValue({ id: 'overnight-1' });

            const result = await scheduleService.createScheduleService({ 
                staffId: userId, 
                date: '2025-01-01',
                startTime: '2025-01-01T19:00:00Z',
                endTime: '2025-01-02T07:00:00Z'
            } as any);

            expect(result.id).toBeDefined();
        });
    });

    // =========================================================================
    // 2. updateScheduleService
    // =========================================================================
    describe('updateScheduleService', () => {
        it('TC_BS_LT_SV_007 - should update successfully when caller is the owner', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ id: scheduleId, staffId: userId });
            (scheduleDao.updateSchedule as jest.Mock).mockResolvedValue({ id: scheduleId, notes: 'Updated' });

            const result = await scheduleService.updateScheduleService({ id: scheduleId, notes: 'Updated' } as any, userId);

            expect(result.notes).toBe('Updated');
        });

        it('TC_BS_LT_SV_008 - should fail (FORBIDDEN) when caller is not the owner', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ id: scheduleId, staffId: 'other-id' });

            await expect(scheduleService.updateScheduleService({ id: scheduleId } as any, userId))
                .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
        });

        it('TC_BS_LT_SV_009 - should fail when endTime <= startTime during update', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ id: scheduleId, staffId: userId });

            await expect(scheduleService.updateScheduleService({ 
                id: scheduleId, 
                startTime: '2025-01-01T10:00:00Z', 
                endTime: '2025-01-01T09:00:00Z' 
            } as any, userId))
            .rejects.toThrow();
        });

        it('TC_BS_LT_SV_010 - should fail when new maxSlot is less than confirmed bookings', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ id: scheduleId, staffId: userId });
            (appointmentDao.countAppointmentsInSchedule as jest.Mock).mockResolvedValue(5);

            await expect(scheduleService.updateScheduleService({ id: scheduleId, maxSlot: 3 } as any, userId))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });

        it('TC_BS_LT_SV_011 - should fail if time change excludes confirmed appointments', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ 
                id: scheduleId, staffId: userId, 
                startTime: new Date('2025-01-01T07:00:00Z'),
                endTime: new Date('2025-01-01T17:00:00Z')
            });
            (appointmentDao.getAppointments as jest.Mock).mockResolvedValue({
                data: [{ startTime: new Date('2025-01-01T07:30:00Z') }]
            });

            await expect(scheduleService.updateScheduleService({ id: scheduleId, startTime: '2025-01-01T08:00:00Z' } as any, userId))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });

    // =========================================================================
    // 3. deleteScheduleService
    // =========================================================================
    describe('deleteScheduleService', () => {
        it('TC_BS_LT_SV_012 - should delete successfully when doctor is the owner', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ id: scheduleId, staffId: userId });
            (scheduleDao.deleteSchedule as jest.Mock).mockResolvedValue({ id: scheduleId });

            const result = await scheduleService.deleteScheduleService(scheduleId, userId);

            expect(result.id).toBe(scheduleId);
        });

        it('TC_BS_LT_SV_013 - should fail (FORBIDDEN) when caller is not the owner', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ id: scheduleId, staffId: 'another-doctor' });

            await expect(scheduleService.deleteScheduleService(scheduleId, 'wrong-user'))
                .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
        });

        it('TC_BS_LT_SV_014 - should fail when shift already has confirmed appointments', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ id: scheduleId, staffId: userId });
            (appointmentDao.countAppointmentsInSchedule as jest.Mock).mockResolvedValue(1);

            await expect(scheduleService.deleteScheduleService(scheduleId, userId))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });

    // =========================================================================
    // 4. getSchedules & getScheduleByIdService (Xem chi tiết ca làm)
    // =========================================================================
    describe('View Details', () => {
        const mockStaff = { id: 'staff-1', userId };

        beforeEach(() => {
            const mockQueryBuilder = { findUnique: jest.fn().mockResolvedValue(mockStaff) };
            (createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
        });

        /**
         * TC_BS_LT_SV_015: Xem chi tiết 1 ca làm thành công
         */
        it('TC_BS_LT_SV_015 - should return schedule details by ID', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ id: scheduleId, staffId: userId });

            const result = await scheduleService.getScheduleByIdService(scheduleId);

            expect(result.id).toBe(scheduleId);
        });

        /**
         * TC_BS_LT_SV_016: Xem danh sách trong 1 ngày cụ thể
         */
        it('TC_BS_LT_SV_016 - should filter schedules by date', async () => {
            (scheduleDao.getListSchedules as jest.Mock).mockResolvedValue({ data: [], metadata: {} });

            const result = await scheduleService.getSchedules({ date: '2025-01-01' }, userId);

            expect(scheduleDao.getListSchedules).toHaveBeenCalledWith({ date: '2025-01-01' }, userId);
        });
    });
});
