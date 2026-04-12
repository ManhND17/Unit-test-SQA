import visitService from '@src/services/visit.service';
import visitDao from '@src/daos/visit.dao';
import prisma from '@src/config/prisma';
import { CustomError, ErrorType } from '@src/core/Error';

// Mock các dependencies
jest.mock('@src/daos/visit.dao');
jest.mock('@src/config/prisma', () => ({
    __esModule: true,
    default: {
        patient: { findUnique: jest.fn() },
        doctor: { findUnique: jest.fn() },
        appointment: { findUnique: jest.fn() },
        medicalService: { findUnique: jest.fn() },
    },
}));

describe('Visit Service - Creation Logic (Doctor Role)', () => {
    const patientUserId = 'patient-1';
    const doctorId = 'doctor-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TC-BS-LK-SV-01: Tiếp nhận và tạo lượt khám thành công
     */
    it('TC-BS-LK-SV-01 - should create a visit with full valid information', async () => {
        // 1. Setup mocks
        (prisma.patient.findUnique as jest.Mock).mockResolvedValue({ userId: patientUserId, ehr: { id: 'ehr-1' } });
        (prisma.doctor.findUnique as jest.Mock).mockResolvedValue({ userId: doctorId });
        (visitDao.createVisit as jest.Mock).mockResolvedValue({ id: 'visit-1', status: 'waiting' });

        const dto = {
            patientUserId: patientUserId,
            doctorId: doctorId,
            type: 'new' as any
        };

        // 2. Action
        const result = await visitService.createVisit(dto);

        // 3. Verification
        expect(result.id).toBe('visit-1');
        expect(visitDao.createVisit).toHaveBeenCalledWith(expect.objectContaining({
            patientUserId: patientUserId,
            doctorId: doctorId
        }));
    });

    /**
     * TC-BS-LK-SV-02: Tạo lượt khám thất bại do thiếu hồ sơ bệnh nhân (EHR)
     */
    it('TC-BS-LK-SV-02 - should throw NOT_FOUND if patient or EHR does not exist', async () => {
        (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(visitService.createVisit({ patientUserId: 'unknown' } as any))
            .rejects.toMatchObject({ type: ErrorType.NOT_FOUND });
    });

    /**
     * TC-BS-LK-SV-03: Thất bại khi chỉ định bác sĩ không tồn tại
     */
    it('TC-BS-LK-SV-03 - should throw NOT_FOUND if doctorId is invalid', async () => {
        (prisma.patient.findUnique as jest.Mock).mockResolvedValue({ userId: patientUserId, ehr: { id: 'ehr-1' } });
        (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(visitService.createVisit({ patientUserId, doctorId: 'non-existent' } as any))
            .rejects.toMatchObject({ type: ErrorType.NOT_FOUND });
    });

    /**
     * TC-BS-LK-SV-04: Tạo lượt khám khi có thông tin chuyên mục dịch vụ (Medical Service)
     */
    it('TC-BS-LK-SV-04 - should validate medicalServiceId during creation', async () => {
        (prisma.patient.findUnique as jest.Mock).mockResolvedValue({ userId: patientUserId, ehr: { id: 'ehr-1' } });
        (prisma.medicalService.findUnique as jest.Mock).mockResolvedValue({ id: 'service-1' });
        (visitDao.createVisit as jest.Mock).mockResolvedValue({ id: 'visit-1' });

        await visitService.createVisit({ patientUserId, medicalServiceId: 'service-1' } as any);

        expect(prisma.medicalService.findUnique).toHaveBeenCalled();
    });
});
