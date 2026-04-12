import visitService from '@src/services/visit.service';
import visitDao from '@src/daos/visit.dao';
import prisma from '@src/config/prisma';
import fileAssetDao from '@src/daos/fileAsset.dao';
import { visitServiceDao } from '@src/daos/visit-service.dao';
import { CustomError, ErrorType } from '@src/core/Error';

// Mock các dependencies để cô lập Unit Test
jest.mock('@src/daos/visit.dao');
jest.mock('@src/daos/fileAsset.dao');
jest.mock('@src/daos/visit-service.dao');
jest.mock('@src/config/prisma', () => ({
    __esModule: true,
    default: {
        doctor: {
            findUnique: jest.fn(),
        },
        visit: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        patient: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
        },
        appointment: {
            findUnique: jest.fn(),
        },
        medicalService: {
            findUnique: jest.fn(),
        },
    },
}));

describe('Visit Service Unit Tests', () => {
    const doctorId = 'doctor-1';
    const patientId = 'patient-1';
    const visitId = 'visit-1';
    const ehrId = 'ehr-1';

    beforeEach(() => {
        // [Rollback]: Đảm bảo tất cả các mocks được reset về trạng thái ban đầu trước mỗi test case
        jest.clearAllMocks();
    });

    // =========================================================================
    // 1. getVisitsOfPatient
    // =========================================================================
    describe('getVisitsOfPatient', () => {
        /**
         * TC-VIS-01: Lấy danh sách lượt khám của bệnh nhân thành công
         * Mô tả: Kiểm tra việc lấy danh sách lượt khám khi bệnh nhân tồn tại
         */
        it('TC-VIS-01 - should return visits for a valid patient', async () => {
            // 1. Setup: Giả lập bệnh nhân và kết quả từ DAO
            (prisma.patient.findUnique as jest.Mock).mockResolvedValue({ userId: patientId });
            (visitDao.getVisitsOfPatient as jest.Mock).mockResolvedValue({ data: [], metadata: {} });

            // 2. Action: Thực hiện lấy danh sách
            const result = await visitService.getVisitsOfPatient(patientId, { page: 1, limit: 10 });

            // 3. Verification (CheckDB): Xác minh kết quả và lời gọi hàm
            expect(result.data).toBeDefined();
            expect(prisma.patient.findUnique).toHaveBeenCalled();
            expect(visitDao.getVisitsOfPatient).toHaveBeenCalledWith(patientId, expect.any(Object));
        });

        /**
         * TC-VIS-02: Lấy danh sách lượt khám thất bại do bệnh nhân không tồn tại
         */
        it('TC-VIS-02 - should throw NOT_FOUND if patient does not exist', async () => {
            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(visitService.getVisitsOfPatient(patientId, {}))
                .rejects.toMatchObject({ type: ErrorType.NOT_FOUND });
        });
    });

    // =========================================================================
    // 2. getVisitsOfDoctor
    // =========================================================================
    describe('getVisitsOfDoctor', () => {
        /**
         * TC-VIS-03: Lấy danh sách lượt khám của bác sĩ thành công
         */
        it('TC-VIS-03 - should return visits for a valid doctor', async () => {
            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue({ userId: doctorId });
            (visitDao.getVisitsOfDoctor as jest.Mock).mockResolvedValue({ data: [], metadata: {} });

            const result = await visitService.getVisitsOfDoctor(doctorId, { page: 1, limit: 10 });

            expect(result.data).toBeDefined();
            expect(visitDao.getVisitsOfDoctor).toHaveBeenCalled();
        });

        /**
         * TC-VIS-04: Lấy danh sách lượt khám thất bại do bác sĩ không tồn tại
         */
        it('TC-VIS-04 - should throw NOT_FOUND if doctor does not exist', async () => {
            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(visitService.getVisitsOfDoctor(doctorId, {}))
                .rejects.toMatchObject({ type: ErrorType.NOT_FOUND });
        });
    });

    // =========================================================================
    // 3. getDetailsOfVisit
    // =========================================================================
    describe('getDetailsOfVisit', () => {
        /**
         * TC-VIS-05: Lấy chi tiết lượt khám thành công (Doctor/Admin)
         */
        it('TC-VIS-05 - should return visit details for doctor', async () => {
            const mockVisit = { id: visitId, ehr: { patientId: 'p1' } };
            (visitDao.getDetailsOfVisit as jest.Mock).mockResolvedValue(mockVisit);

            const result = await visitService.getDetailsOfVisit(visitId, { id: doctorId, role: 'doctor' } as any);

            expect(result).toEqual(mockVisit);
        });

        /**
         * TC-VIS-06: Lấy chi tiết lượt khám thất bại do không có quyền (Patient lạ)
         */
        it('TC-VIS-06 - should throw FORBIDDEN if unauthorized patient', async () => {
            const mockVisit = { id: visitId, ehr: { patientId: 'other-patient' } };
            (visitDao.getDetailsOfVisit as jest.Mock).mockResolvedValue(mockVisit);

            await expect(visitService.getDetailsOfVisit(visitId, { id: 'current-patient', role: 'patient' } as any))
                .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
        });
    });

    // =========================================================================
    // 4. createVisit
    // =========================================================================
    describe('createVisit', () => {
        /**
         * TC-VIS-07: Tạo lượt khám thành công
         */
        it('TC-VIS-07 - should create visit successfully', async () => {
            (prisma.patient.findUnique as jest.Mock).mockResolvedValue({ userId: patientId, ehr: { id: ehrId } });
            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue({ userId: doctorId });
            (visitDao.createVisit as jest.Mock).mockResolvedValue({ id: 'new-v' });

            const result = await visitService.createVisit({ patientUserId: patientId, doctorId } as any);

            expect(result.id).toBe('new-v');
            expect(visitDao.createVisit).toHaveBeenCalledWith(expect.objectContaining({ ehrId }));
        });

        /**
         * TC-VIS-08: Tạo lượt khám thất bại do thiếu bác sĩ
         */
        it('TC-VIS-08 - should throw NOT_FOUND if assigned doctor not found', async () => {
            (prisma.patient.findUnique as jest.Mock).mockResolvedValue({ userId: patientId, ehr: { id: ehrId } });
            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(visitService.createVisit({ patientUserId: patientId, doctorId } as any))
                .rejects.toMatchObject({ type: ErrorType.NOT_FOUND });
        });
    });

    // =========================================================================
    // 5. completeVisit
    // =========================================================================
    describe('completeVisit', () => {
        /**
         * TC-VIS-09: Hoàn thành lượt khám thành công
         */
        it('TC-VIS-09 - should complete visit successfully', async () => {
            const mockVisit = { id: visitId, doctorId, status: 'pending' };
            (prisma.visit.findUnique as jest.Mock).mockResolvedValue(mockVisit);
            (prisma.visit.update as jest.Mock).mockResolvedValue({ ...mockVisit, status: 'completed' });

            const result = await visitService.completeVisit(visitId, doctorId, 'doctor');

            expect(result.status).toBe('completed');
            expect(prisma.visit.update).toHaveBeenCalled();
        });

        /**
         * TC-VIS-10: Hoàn thành lượt khám thất bại vì đã hoàn thành rồi
         */
        it('TC-VIS-10 - should throw BAD_REQUEST if already completed', async () => {
            (prisma.visit.findUnique as jest.Mock).mockResolvedValue({ id: visitId, doctorId, status: 'completed' });

            await expect(visitService.completeVisit(visitId, doctorId, 'doctor'))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });

    // =========================================================================
    // 6. cancelVisit
    // =========================================================================
    describe('cancelVisit', () => {
        /**
         * TC-VIS-11: Hủy lượt khám thành công
         */
        it('TC-VIS-11 - should cancel visit correctly', async () => {
            const mockVisit = { id: visitId, doctorId, status: 'pending' };
            (prisma.visit.findUnique as jest.Mock).mockResolvedValue(mockVisit);
            (prisma.visit.update as jest.Mock).mockResolvedValue({ id: visitId, status: 'cancelled' });

            const result = await visitService.cancelVisit(visitId, doctorId, 'doctor', { reason: 'No show' });

            expect(result.status).toBe('cancelled');
        });
    });

    // =========================================================================
    // 7. calculateVisitCost
    // =========================================================================
    describe('calculateVisitCost', () => {
        /**
         * TC-VIS-12: Tính toán chi phí chính xác
         */
        it('TC-VIS-12 - should calculate cost correctly', async () => {
            const mockVisitData = {
                visitServices: [{ price: 50, quantity: 2 }],
                prescriptions: [{ medicineUsages: [{ price: 30 }] }]
            };
            (prisma.visit.findUnique as jest.Mock).mockResolvedValue(mockVisitData);

            const result = await visitService.calculateVisitCost(visitId);

            expect(result.totalCost).toBe(130); // 50*2 + 30
        });
    });

    // =========================================================================
    // 8. updateVisitStatus & updateNextVisitDate
    // =========================================================================
    describe('Status and Date Updates', () => {
        /**
         * TC-VIS-13: Cập nhật trạng thái trực tiếp
         */
        it('TC-VIS-13 - should update status', async () => {
            (prisma.visit.update as jest.Mock).mockResolvedValue({ status: 'completed' });
            const result = await visitService.updateVisitStatus(visitId, 'completed');
            expect(result.status).toBe('completed');
        });

        /**
         * TC-VIS-14: Cập nhật ngày hẹn khám tiếp theo
         */
        it('TC-VIS-14 - should update next visit date', async () => {
            const nextDate = '2025-01-01';
            (prisma.visit.update as jest.Mock).mockResolvedValue({ nextVisitDate: new Date(nextDate) });
            const result = await visitService.updateNextVisitDate(visitId, nextDate);
            expect(result.nextVisitDate).toBeDefined();
        });
    });

    // =========================================================================
    // 9. searchVisits
    // =========================================================================
    describe('searchVisits', () => {
        /**
         * TC-VIS-15: Tìm kiếm lượt khám thành công
         */
        it('TC-VIS-15 - should search visits with valid patient', async () => {
            (prisma.patient.findFirst as jest.Mock).mockResolvedValue({ userId: patientId });
            (visitDao.searchVisits as jest.Mock).mockResolvedValue({ data: [] });

            const result = await visitService.searchVisits(patientId, {});

            expect(result.data).toBeDefined();
            expect(visitDao.searchVisits).toHaveBeenCalled();
        });
    });

    // =========================================================================
    // 10. getTasksOfDoctor
    // =========================================================================
    describe('getTasksOfDoctor', () => {
        /**
         * TC-VIS-16: Lấy danh sách nhiệm vụ của bác sĩ thành công
         */
        it('TC-VIS-16 - should return tasks for doctor', async () => {
            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue({ userId: doctorId });
            (visitDao.getTasksOfDoctor as jest.Mock).mockResolvedValue({ data: [] });

            const result = await visitService.getTasksOfDoctor(doctorId, {});

            expect(result.data).toBeDefined();
        });
    });

    // =========================================================================
    // 11. updateVisitServiceStatus
    // =========================================================================
    describe('updateVisitServiceStatus', () => {
        /**
         * TC-VIS-17: Cập nhật trạng thái dịch vụ trong lượt khám
         */
        it('TC-VIS-17 - should update visit service status', async () => {
            (visitServiceDao.updateStatus as jest.Mock).mockResolvedValue({ status: 'completed' });

            const result = await visitService.updateVisitServiceStatus('vs-1', 'completed');

            expect(result.status).toBe('completed');
            expect(visitServiceDao.updateStatus).toHaveBeenCalledWith('vs-1', 'completed');
        });
    });
});
