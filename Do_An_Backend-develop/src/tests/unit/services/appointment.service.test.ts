import appointmentService from '@src/services/appointment.service';
import appointmentDao from '@src/daos/appointment.dao';
import doctorDao from '@src/daos/doctor.dao';
import doctorServiceDao from '@src/daos/doctor-service.dao';
import notificationService from '@src/services/notification.service';
import prisma from '@src/config/prisma';
import { CustomError, ErrorType, ValidationError } from '@src/core/Error';

// Mock các dependencies
jest.mock('@src/daos/appointment.dao');
jest.mock('@src/daos/doctor.dao');
jest.mock('@src/daos/doctor-service.dao');
jest.mock('@src/services/notification.service');
jest.mock('@src/config/prisma', () => ({
    __esModule: true,
    default: {
        $transaction: jest.fn((cb) => cb({
            appointment: {
                count: jest.fn(),
                create: jest.fn(),
            },
            $queryRaw: jest.fn(),
        })),
    },
}));

describe('Appointment Service Unit Tests', () => {
    const appointmentId = 'f1b9f71c-4b6e-4458-a536-419b67482fb1';
    const doctorId = 'f1b9f71c-4b6e-4458-a536-419b67482fb2';
    const patientId = 'f1b9f71c-4b6e-4458-a536-419b67482fb3';

    beforeEach(() => {
        // [Rollback]: Reset mock state sau mỗi lần chạy test
        jest.clearAllMocks();
    });

    // =========================================================================
    // 1. getAvailableSlots
    // =========================================================================
    describe('getAvailableSlots', () => {
        /**
         * TC-APP-01: Lấy danh sách slots trống thành công
         * Mô tả: Bác sĩ có lịch trực và chưa có ai đặt hẹn
         */
        it('TC-APP-01 - should return available slots for doctor', async () => {
            // 1. Setup
            const query = { doctorId, date: '2100-05-05' };
            (doctorDao.getDoctorById as jest.Mock).mockResolvedValue({ userId: doctorId, staff: { user: { name: {} } } });
            (appointmentDao.getDoctorSchedulesByDate as jest.Mock).mockResolvedValue([
                { id: 'sch-1', startTime: new Date('2100-05-05T08:00:00Z'), endTime: new Date('2100-05-05T10:00:00Z'), maxSlot: 2, room: { name: 'R1' }, department: { name: 'D1' } }
            ]);
            (appointmentDao.countAppointmentsInSchedule as jest.Mock).mockResolvedValue(0);
            (appointmentDao.getBookedTimesInSchedule as jest.Mock).mockResolvedValue([]);

            // 2. Action
            const result = await appointmentService.getAvailableSlots(query);

            // 3. Verification
            expect(result.slots.length).toBeGreaterThan(0);
            expect(doctorDao.getDoctorById).toHaveBeenCalledWith(doctorId);
        });

        /**
         * TC-APP-02: Lấy slots thất bại vì bác sĩ không tồn tại
         */
        it('TC-APP-02 - should throw NOT_FOUND for non-existent doctor', async () => {
            (doctorDao.getDoctorById as jest.Mock).mockResolvedValue(null);

            await expect(appointmentService.getAvailableSlots({ doctorId, date: '2100-05-05' }))
                .rejects.toMatchObject({ type: ErrorType.NOT_FOUND });
        });
    });

    // =========================================================================
    // 2. getAppointmentById
    // =========================================================================
    describe('getAppointmentById', () => {
        /**
         * TC-APP-03: Lấy chi tiết lịch hẹn thành công
         */
        it('TC-APP-03 - should return appointment details', async () => {
            const mockApp = {
                id: appointmentId,
                patient: { userId: 'p1', user: { email: 'e', name: {} } },
                doctor: { userId: 'd1', staff: { user: { name: {} } } }
            };
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue(mockApp);

            const result = await appointmentService.getAppointmentById(appointmentId);

            expect(result.id).toBe(appointmentId);
            expect(appointmentDao.getAppointmentById).toHaveBeenCalledWith(appointmentId);
        });

        /**
         * TC-APP-04: Lấy chi tiết thất bại do không tìm thấy
         */
        it('TC-APP-04 - should throw NOT_FOUND for invalid appointment id', async () => {
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue(null);

            await expect(appointmentService.getAppointmentById(appointmentId))
                .rejects.toMatchObject({ type: ErrorType.NOT_FOUND });
        });
    });

    // =========================================================================
    // 3. createAppointment
    // =========================================================================
    describe('createAppointment', () => {
        /**
         * TC-APP-05: Tạo lịch hẹn mới thành công
         */
        it('TC-APP-05 - should create appointment successfully', async () => {
            // 1. Setup
            const data = { doctorId, startTime: '2100-06-01T10:00:00Z', reason: 'Sick long enough' };
            (doctorDao.getDoctorById as jest.Mock).mockResolvedValue({ id: doctorId });
            (appointmentDao.hasConflictingAppointment as jest.Mock).mockResolvedValue(false);
            
            const mockCreatedApp = {
                id: appointmentId,
                patient: { user: { name: {}, email: 'e', phone: 'p' }, patientId: 'PID' },
                doctor: { staff: { user: { name: {} } } },
                startTime: new Date('2100-06-01T10:00:00Z'),
                createdAt: new Date(),
                updatedAt: new Date()
            };
            // Mock transaction results
            const tx = {
                appointment: { count: jest.fn().mockResolvedValue(0), create: jest.fn().mockResolvedValue(mockCreatedApp) },
                $queryRaw: jest.fn().mockResolvedValue([{ user_id: doctorId }])
            };
            (prisma.$transaction as jest.Mock).mockImplementation((cb) => cb(tx));

            // 2. Action
            const result = await appointmentService.createAppointment(data, patientId);

            // 3. Verification (CheckDB)
            expect(result.id).toBe(appointmentId);
            expect(notificationService.createAndEmit).toHaveBeenCalled();
        });

        /**
         * TC-APP-06: Tạo lịch hẹn thất bại do bị trùng giờ (Conflict)
         */
        it('TC-APP-06 - should throw BAD_REQUEST if conflict exists', async () => {
            const data = { doctorId, startTime: '2100-06-01T10:00:00Z', reason: 'Sick long enough' };
            (doctorDao.getDoctorById as jest.Mock).mockResolvedValue({ id: doctorId });
            (appointmentDao.hasConflictingAppointment as jest.Mock).mockResolvedValue(true);

            await expect(appointmentService.createAppointment(data, patientId))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });

    // =========================================================================
    // 4. approveAppointment & rejectAppointment
    // =========================================================================
    describe('approveAppointment & rejectAppointment', () => {
        const mockPendingApp = {
            id: appointmentId,
            status: 'pending',
            patientId: 'p1',
            doctorId: 'd1',
            startTime: new Date('2100-06-01T10:00:00Z'),
            doctor: { staff: { user: { name: {} } } },
            patient: { user: { name: {} } }
        };

        /**
         * TC-APP-07: Bác sĩ xác nhận lịch hẹn thành công
         */
        it('TC-APP-07 - should approve pending appointment successfully', async () => {
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue(mockPendingApp);
            (appointmentDao.updateAppointment as jest.Mock).mockResolvedValue({ ...mockPendingApp, status: 'confirmed' });

            const result = await appointmentService.approveAppointment(appointmentId, {}, 'doctor');

            expect(result.status).toBe('confirmed');
            expect(notificationService.createAndEmit).toHaveBeenCalled();
        });

        /**
         * TC-APP-08: Xác nhận lịch hẹn thất bại khi trạng thái không phải Pending
         */
        it('TC-APP-08 - should throw BAD_REQUEST if status is not pending', async () => {
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue({ ...mockPendingApp, status: 'confirmed' });

            // Sử dụng dữ liệu hợp lệ: {} hoặc { notes: 'x' }
            await expect(appointmentService.approveAppointment(appointmentId, { notes: 'Ghi chú bác sĩ' }, 'doctor'))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });

        /**
         * TC-APP-09: Bệnh nhân không có quyền xác nhận lịch (Forbidden)
         */
        it('TC-APP-09 - should throw FORBIDDEN if user is patient', async () => {
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue(mockPendingApp);

            await expect(appointmentService.approveAppointment(appointmentId, {}, 'patient'))
                .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
        });

        /**
         * TC-APP-10: Bác sĩ từ chối lịch hẹn thành công kèm lý do
         */
        it('TC-APP-10 - should reject pending appointment with reason', async () => {
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue(mockPendingApp);
            (appointmentDao.updateAppointment as jest.Mock).mockResolvedValue({ ...mockPendingApp, status: 'rejected' });

            const result = await appointmentService.rejectAppointment(appointmentId, { reasonCancel: 'Bác sĩ bận việc đột xuất' }, 'doctor');

            expect(result.status).toBe('rejected');
            expect(notificationService.createAndEmit).toHaveBeenCalled();
        });

        /**
         * TC-APP-11: Từ chối lịch hẹn thất bại khi trạng thái không phải Pending
         */
        it('TC-APP-11 - should throw BAD_REQUEST if status is not pending during rejection', async () => {
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue({ ...mockPendingApp, status: 'cancelled' });

            // Sử dụng lý do > 10 ký tự để vượt qua bước validate đầu vào
            await expect(appointmentService.rejectAppointment(appointmentId, { reasonCancel: 'Bác sĩ bận lịch phẫu thuật đột xuất' }, 'doctor'))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });
});
