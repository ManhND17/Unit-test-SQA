import prescriptionService from '@src/services/prescription.service';
import * as prescriptionDao from '@src/daos/prescription.dao';
import * as visitDao from '@src/daos/visit.dao';
import { CustomError, ErrorType } from '@src/core/Error';

// Mock các dependencies
jest.mock('@src/daos/prescription.dao');
jest.mock('@src/daos/visit.dao');

describe('Prescription Service - Management & Update (Doctor Role)', () => {
    const userId = 'doctor-1';
    const presId = 'pres-1';
    const visitId = 'visit-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TC-BS-LK-DT-04: Thêm thuốc vào đơn thuốc hiện có thành công
     */
    it('TC-BS-LK-DT-04 - should add medicines to an existing prescription', async () => {
        // 1. Setup
        (prescriptionDao.findPrescriptionById as jest.Mock).mockResolvedValue({ id: presId, visitId, createdByUserId: userId });
        (visitDao.findVisitById as jest.Mock).mockResolvedValue({ id: visitId, doctorId: userId, status: 'in_progress' });
        (prescriptionDao.checkPrescriptionOwnership as jest.Mock).mockResolvedValue(true);
        (prescriptionDao.batchCreateMedicineUsages as jest.Mock).mockResolvedValue([{ id: 'mu-1' }]);

        const medicines = [{ medicineId: 'med-1', quantity: 2 }];

        // 2. Action
        const result = await prescriptionService.addMedicinesToPrescription(presId, userId, medicines as any);

        // 3. Verification
        expect(result).toHaveLength(1);
        expect(prescriptionDao.batchCreateMedicineUsages).toHaveBeenCalled();
    });

    /**
     * TC-BS-LK-DT-05: Chặn xóa thuốc khỏi đơn khi lượt khám đã kết thúc (Audit Success)
     */
    it('TC-BS-LK-DT-05 - should throw BAD_REQUEST if deleting medicine usage from a COMPLETED visit', async () => {
        const muId = 'mu-1';
        (prescriptionDao.findMedicineUsageById as jest.Mock).mockResolvedValue({ id: muId, prescriptionId: presId });
        (prescriptionDao.findPrescriptionById as jest.Mock).mockResolvedValue({ id: presId, visitId });
        (visitDao.findVisitById as jest.Mock).mockResolvedValue({ id: visitId, status: 'completed' });

        await expect(prescriptionService.deleteMedicineUsage(muId, userId))
            .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
    });

    /**
     * TC-BS-LK-DT-06: Cập nhật thông tin dùng thuốc thành công
     */
    it('TC-BS-LK-DT-06 - should update medicine usage if owner and visit is active', async () => {
        const muId = 'mu-1';
        (prescriptionDao.findMedicineUsageById as jest.Mock).mockResolvedValue({ id: muId, prescriptionId: presId });
        (prescriptionDao.findPrescriptionById as jest.Mock).mockResolvedValue({ id: presId, visitId, createdByUserId: userId });
        (visitDao.findVisitById as jest.Mock).mockResolvedValue({ id: visitId, status: 'in_progress' });
        (prescriptionDao.checkPrescriptionOwnership as jest.Mock).mockResolvedValue(true);
        (prescriptionDao.updateMedicineUsage as jest.Mock).mockResolvedValue({ id: muId, quantity: 5 });

        const result = await prescriptionService.updateMedicineUsage(muId, userId, { quantity: 5 } as any);

        expect(result.quantity).toBe(5);
    });
});
