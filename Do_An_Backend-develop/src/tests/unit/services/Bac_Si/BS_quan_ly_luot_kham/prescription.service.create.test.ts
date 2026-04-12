import prescriptionService from '@src/services/prescription.service';
import * as prescriptionDao from '@src/daos/prescription.dao';
import * as visitDao from '@src/daos/visit.dao';
import { CustomError, ErrorType } from '@src/core/Error';

// Mock các dependencies
jest.mock('@src/daos/prescription.dao');
jest.mock('@src/daos/visit.dao');

describe('Prescription Service - Creation (Doctor Role)', () => {
    const userId = 'doctor-1';
    const visitId = 'visit-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TC-BS-LK-DT-01: Tạo đơn thuốc thành công
     */
    it('TC-BS-LK-DT-01 - should create a prescription for an active visit', async () => {
        // 1. Setup
        (visitDao.findVisitById as jest.Mock).mockResolvedValue({ id: visitId, doctorId: userId, status: 'in_progress' });
        (prescriptionDao.createPrescription as jest.Mock).mockResolvedValue({ id: 'pres-1', visitId });

        const dto = {
            visitId,
            medicines: [
                { drugName: 'Panadol', quantity: 10 }
            ]
        };

        // 2. Action
        const result = await prescriptionService.createPrescription(userId, dto as any);

        // 3. Verification
        expect(result.id).toBe('pres-1');
        expect(prescriptionDao.createPrescription).toHaveBeenCalled();
    });

    /**
     * TC-BS-LK-DT-02: Thất bại khi tạo đơn thuốc cho lượt khám đã kết thúc (Audit Success)
     * Mã nguồn đã xử lý: validateVisitForPrescription ném BÁD_REQUEST
     */
    it('TC-BS-LK-DT-02 - should throw BAD_REQUEST if visit is already completed', async () => {
        (visitDao.findVisitById as jest.Mock).mockResolvedValue({ id: visitId, doctorId: userId, status: 'completed' });

        await expect(prescriptionService.createPrescription(userId, { visitId } as any))
            .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
    });

    /**
     * TC-BS-LK-DT-03: Thất bại khi bác sĩ không được phân công lượt khám đó
     */
    it('TC-BS-LK-DT-03 - should throw FORBIDDEN if doctor is not assigned to the visit', async () => {
        (visitDao.findVisitById as jest.Mock).mockResolvedValue({ id: visitId, doctorId: 'other-doctor', status: 'in_progress' });

        await expect(prescriptionService.createPrescription(userId, { visitId } as any))
            .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
    });
});
