import appointmentService from '@src/services/appointment.service';
import appointmentDao from '@src/daos/appointment.dao';
import doctorDao from '@src/daos/doctor.dao';
import notificationService from '@src/services/notification.service';
import { ErrorType } from '@src/core/Error';

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

describe('Appointment Service Unit Tests (Doctor Feature Management)', () => {
    const appointmentId = 'f1b9f71c-4b6e-4458-a536-419b67482fb1';
    const doctorId = 'f1b9f71c-4b6e-4458-a536-419b67482fb2';
    const patientId = 'f1b9f71c-4b6e-4458-a536-419b67482fb3';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // =========================================================================
    // 1. getAppointmentById
    // =========================================================================
    describe('getAppointmentById', () => {
        /**
         * TC-BS-LH-01: Lấy chi tiết lịch hẹn thành công theo ID
         */
        it('TC-BS-LH-01 - should return appointment details by ID', async () => {
            const mockApp = {
                id: appointmentId,
                patient: { userId: patientId, user: { email: 'patient@test.com', name: {} } },
                doctor: { userId: doctorId, staff: { user: { name: {} } } }
            };
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue(mockApp);

            const result = await appointmentService.getAppointmentById(appointmentId);

            expect(result.id).toBe(appointmentId);
            expect(appointmentDao.getAppointmentById).toHaveBeenCalledWith(appointmentId);
        });

        /**
         * TC-BS-LH-02: Lấy chi tiết thất bại do ID không tồn tại
         */
        it('TC-BS-LH-02 - should throw NOT_FOUND for invalid appointment id', async () => {
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue(null);

            await expect(appointmentService.getAppointmentById(appointmentId))
                .rejects.toMatchObject({ type: ErrorType.NOT_FOUND });
        });
    });

    // =========================================================================
    // 2. getAppointments (Search & Filter)
    // =========================================================================
    describe('getAppointments (Searching & Filtering)', () => {
        const mockPagination = { page: 1, limit: 10, totalItems: 1, totalPages: 1, hasNext: false, hasPrev: false };
        const mockApt = {
            id: appointmentId,
            patient: { userId: patientId, user: { name: { firstName: 'Van A', lastName: 'Nguyen' }, email: 'a@test.com' } },
            doctor: { userId: doctorId, staff: { user: { name: {} } } }
        };

        /**
         * TC-BS-LH-03: Tìm kiếm lịch hẹn theo tên bệnh nhân (có kết quả)
         */
        it('TC-BS-LH-03 - should search appointments by name successfully', async () => {
            (appointmentDao.getAppointments as jest.Mock).mockResolvedValue({ 
                data: [mockApt], 
                metadata: mockPagination 
            });

            const result = await appointmentService.getAppointments({ search: 'Nguyen Van A' });

            expect(result.appointments.length).toBe(1);
            expect(appointmentDao.getAppointments).toHaveBeenCalledWith(expect.objectContaining({ search: 'Nguyen Van A' }));
        });

        /**
         * TC-BS-LH-04: Tìm kiếm lịch hẹn theo tên (không có kết quả)
         */
        it('TC-BS-LH-04 - should return empty list when no appointment matches name', async () => {
            (appointmentDao.getAppointments as jest.Mock).mockResolvedValue({ 
                data: [], 
                metadata: { ...mockPagination, totalItems: 0, totalPages: 0 } 
            });

            const result = await appointmentService.getAppointments({ search: 'NonExistentName' });

            expect(result.appointments.length).toBe(0);
            expect(appointmentDao.getAppointments).toHaveBeenCalledWith(expect.objectContaining({ search: 'NonExistentName' }));
        });

        /**
         * TC-BS-LH-05: Lọc lịch hẹn theo khoảng ngày
         */
        it('TC-BS-LH-05 - should filter appointments by date range', async () => {
            const fromDate = new Date('2024-01-01');
            const toDate = new Date('2024-01-31');
            (appointmentDao.getAppointments as jest.Mock).mockResolvedValue({ data: [mockApt], metadata: mockPagination });

            const result = await appointmentService.getAppointments({ fromDate, toDate });

            expect(result.appointments.length).toBe(1);
            expect(appointmentDao.getAppointments).toHaveBeenCalledWith(expect.objectContaining({ fromDate, toDate }));
        });

        /**
         * TC-BS-LH-06: Lọc lịch hẹn theo trạng thái
         */
        it('TC-BS-LH-06 - should filter appointments by status', async () => {
            (appointmentDao.getAppointments as jest.Mock).mockResolvedValue({ data: [mockApt], metadata: mockPagination });

            const result = await appointmentService.getAppointments({ status: 'confirmed' });

            expect(result.appointments.length).toBe(1);
            expect(appointmentDao.getAppointments).toHaveBeenCalledWith(expect.objectContaining({ status: 'confirmed' }));
        });
    });

    // =========================================================================
    // 3. approveAppointment & rejectAppointment
    // =========================================================================
    describe('approveAppointment & rejectAppointment', () => {
        const mockPendingApp = {
            id: appointmentId,
            status: 'pending',
            patientId: patientId,
            doctorId: doctorId,
            startTime: new Date('2100-06-01T10:00:00Z'),
            doctor: { staff: { user: { name: {} } } },
            patient: { user: { name: {} } }
        };

        /**
         * TC-BS-LH-07: Bác sĩ xác nhận lịch hẹn (Thành công)
         */
        it('TC-BS-LH-07 - should approve pending appointment successfully', async () => {
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue(mockPendingApp);
            (appointmentDao.updateAppointment as jest.Mock).mockResolvedValue({ ...mockPendingApp, status: 'confirmed' });

            const result = await appointmentService.approveAppointment(appointmentId, {}, 'doctor');

            expect(result.status).toBe('confirmed');
            expect(notificationService.createAndEmit).toHaveBeenCalled();
        });

        /**
         * TC-BS-LH-08: Xác nhận lịch hẹn thất bại khi trạng thái không phải Pending (Ví dụ: Đã xác nhận trước đó)
         */
        it('TC-BS-LH-08 - should throw BAD_REQUEST if status is not pending during approval', async () => {
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue({ ...mockPendingApp, status: 'confirmed' });

            await expect(appointmentService.approveAppointment(appointmentId, { notes: 'Ghi chú' }, 'doctor'))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });

        /**
         * TC-BS-LH-09: Bệnh nhân/Vai trò khác không có quyền xác nhận lịch (Forbidden)
         */
        it('TC-BS-LH-09 - should throw FORBIDDEN if user role is not doctor', async () => {
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue(mockPendingApp);

            await expect(appointmentService.approveAppointment(appointmentId, {}, 'patient'))
                .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
        });

        /**
         * TC-BS-LH-10: Bác sĩ từ chối lịch hẹn (Thành công)
         */
        it('TC-BS-LH-10 - should reject pending appointment with reason', async () => {
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue(mockPendingApp);
            (appointmentDao.updateAppointment as jest.Mock).mockResolvedValue({ ...mockPendingApp, status: 'rejected' });

            const result = await appointmentService.rejectAppointment(appointmentId, { reasonCancel: 'Bác sĩ bận việc đột xuất' }, 'doctor');

            expect(result.status).toBe('rejected');
            expect(notificationService.createAndEmit).toHaveBeenCalled();
        });

        /**
         * TC-BS-LH-11: Từ chối lịch hẹn thất bại khi trạng thái không phải Pending
         */
        it('TC-BS-LH-11 - should throw BAD_REQUEST if status is not pending during rejection', async () => {
            (appointmentDao.getAppointmentById as jest.Mock).mockResolvedValue({ ...mockPendingApp, status: 'cancelled' });

            await expect(appointmentService.rejectAppointment(appointmentId, { reasonCancel: 'Lý do dài hơn 10 ký tự' }, 'doctor'))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });
});
