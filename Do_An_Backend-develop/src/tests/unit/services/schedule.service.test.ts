import scheduleService from '@src/services/schedule.service';
import * as scheduleDao from '@src/daos/schedule.dao';
import { createQueryBuilder } from '@src/helpers/queryBuilder';
import { CustomError, ErrorType } from '@src/core/Error';

// Mock các dependencies
jest.mock('@src/daos/schedule.dao');
jest.mock('@src/helpers/queryBuilder');

describe('Schedule Service Unit Tests', () => {
    const scheduleId = 'sch-1';
    const userId = 'user-1';

    beforeEach(() => {
        // [Rollback]: Reset mock state
        jest.clearAllMocks();
    });

    // =========================================================================
    // 1. getSchedules
    // =========================================================================
    describe('getSchedules', () => {
        /**
         * TC-SCH-01: Lấy danh sách lịch làm việc của nhân viên thành công
         */
        it('TC-SCH-01 - should return schedules for a valid staff', async () => {
            // 1. Setup
            const mockStaff = { id: 'staff-1', userId };
            const mockQueryBuilder = { findUnique: jest.fn().mockResolvedValue(mockStaff) };
            (createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
            (scheduleDao.getListSchedules as jest.Mock).mockResolvedValue({ data: [], metadata: {} });

            // 2. Action
            const result = await scheduleService.getSchedules({}, userId);

            // 3. Verification (CheckDB)
            expect(result.data).toBeDefined();
            expect(mockQueryBuilder.findUnique).toHaveBeenCalledWith({ userId });
        });

        /**
         * TC-SCH-02: Lấy danh sách thất bại do nhân viên không tồn tại
         */
        it('TC-SCH-02 - should throw NOT_FOUND if staff does not exist', async () => {
            const mockQueryBuilder = { findUnique: jest.fn().mockResolvedValue(null) };
            (createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

            await expect(scheduleService.getSchedules({}, userId))
                .rejects.toMatchObject({ type: ErrorType.NOT_FOUND });
        });
    });

    // =========================================================================
    // 2. createScheduleService
    // =========================================================================
    describe('createScheduleService', () => {
        /**
         * TC-SCH-03: Tạo lịch làm việc thành công
         */
        it('TC-SCH-03 - should create schedule for valid staff', async () => {
            const mockStaff = { id: 'staff-1' };
            const mockQueryBuilder = { findUnique: jest.fn().mockResolvedValue(mockStaff) };
            (createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
            (scheduleDao.createSchedule as jest.Mock).mockResolvedValue({ id: scheduleId });

            const result = await scheduleService.createScheduleService({ staffId: userId } as any);

            expect(result.id).toBe(scheduleId);
            expect(scheduleDao.createSchedule).toHaveBeenCalled();
        });

        /**
         * TC-SCH-07: Tạo lịch làm việc trong quá khứ (Kỳ vọng: Thất bại)
         */
        it('TC-SCH-07 - should throw BAD_REQUEST when creating schedule in the past', async () => {
            const pastDate = '2000-01-01T10:00:00Z';
            await expect(scheduleService.createScheduleService({ staffId: userId, date: pastDate, startTime: pastDate, endTime: '2000-01-01T16:00:00Z' } as any))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });

        /**
         * TC-SCH-08: Thời gian kết thúc < Thời gian bắt đầu
         */
        it('TC-SCH-08 - should throw BAD_REQUEST when endTime < startTime', async () => {
            await expect(scheduleService.createScheduleService({ 
                staffId: userId, 
                startTime: '2100-01-01T10:00:00Z', 
                endTime: '2100-01-01T09:00:00Z' 
            } as any))
            .rejects.toThrow();
        });

        /**
         * TC-SCH-09: Thời gian ca làm việc quá ngắn (< 5 giờ)
         */
        it('TC-SCH-09 - should throw BAD_REQUEST when duration is less than 5 hours', async () => {
            await expect(scheduleService.createScheduleService({ 
                staffId: userId, 
                startTime: '2100-01-01T08:00:00Z', 
                endTime: '2100-01-01T10:00:00Z' 
            } as any))
            .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });

        /**
         * TC-SCH-10: Kiểm tra trùng ca (Overlap)
         */
        it('TC-SCH-10 - should throw BAD_REQUEST if schedule overlaps with existing one', async () => {
            (scheduleDao.getListSchedules as jest.Mock).mockResolvedValue({
                data: [{ startTime: new Date('2100-01-01T07:00:00Z'), endTime: new Date('2100-01-01T13:00:00Z') }]
            });

            await expect(scheduleService.createScheduleService({ 
                staffId: userId, 
                startTime: '2100-01-01T09:00:00Z', 
                endTime: '2100-01-01T19:00:00Z' 
            } as any))
            .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });

    // =========================================================================
    // 3. updateScheduleService
    // =========================================================================
    describe('updateScheduleService', () => {
        /**
         * TC-SCH-04: Cập nhật lịch làm việc thành công
         */
        it('TC-SCH-04 - should update schedule if owner', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ id: scheduleId, staffId: userId });
            (scheduleDao.updateSchedule as jest.Mock).mockResolvedValue({ id: scheduleId, notes: 'updated' });

            const result = await scheduleService.updateScheduleService({ id: scheduleId, notes: 'updated' } as any, userId);

            expect(result.notes).toBe('updated');
        });

        /**
         * TC-SCH-05: Cập nhật thất bại do không có quyền (Forbidden)
         */
        it('TC-SCH-05 - should throw FORBIDDEN if not the owner', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ id: scheduleId, staffId: 'other-user' });

            await expect(scheduleService.updateScheduleService({ id: scheduleId } as any, userId))
                .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
        });

        /**
         * TC-SCH-12: Chỉnh sửa ca làm vi phạm thời gian bệnh nhân đã hẹn
         */
        it('TC-SCH-12 - should throw BAD_REQUEST when updating shift that conflicts with existing appointments', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ 
                id: scheduleId, 
                staffId: userId, 
                startTime: new Date('2100-01-01T08:00:00Z'),
                endTime: new Date('2100-01-01T14:00:00Z')
            });

            await expect(scheduleService.updateScheduleService({ id: scheduleId, endTime: '2100-01-01T12:00:00Z' } as any, userId))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });

    // =========================================================================
    // 4. deleteScheduleService
    // =========================================================================
    describe('deleteScheduleService', () => {
        /**
         * TC-SCH-06: Xóa lịch làm việc thành công
         */
        it('TC-SCH-06 - should delete schedule if owner', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ id: scheduleId, staffId: userId });
            (scheduleDao.deleteSchedule as jest.Mock).mockResolvedValue({ id: scheduleId });

            const result = await scheduleService.deleteScheduleService(scheduleId, userId);

            expect(result.id).toBe(scheduleId);
            expect(scheduleDao.deleteSchedule).toHaveBeenCalledWith(scheduleId);
        });

        /**
         * TC-SCH-11: Chặn xóa ca làm việc khi đã có bệnh nhân hẹn
         */
        it('TC-SCH-11 - should throw BAD_REQUEST when deleting schedule with confirmed appointments', async () => {
            (scheduleDao.getScheduleById as jest.Mock).mockResolvedValue({ id: scheduleId, staffId: userId });
            // Mock logic check appointments (theo kịch bản lý thuyết)
            await expect(scheduleService.deleteScheduleService(scheduleId, userId))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });
});
