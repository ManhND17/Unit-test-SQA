import medicalRecordService from '@src/services/medical-record.service';
import * as medicalRecordDao from '@src/daos/medical-record.dao';
import { CustomError, ErrorType } from '@src/core/Error';
import * as visitDao from '@src/daos/visit.dao';

// Mock các dependencies
jest.mock('@src/daos/medical-record.dao');
jest.mock('@src/daos/visit.dao');
jest.mock('@src/services/cloudinary.service');
jest.mock('@src/daos/fileAsset.dao');

describe('Medical Record Service - Update (Doctor Role)', () => {
    const doctorId = 'doctor-1';
    const recordId = 'mr-1';
    const visitId = 'visit-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TC-BS-LK-HS-04: Cập nhật chẩn đoán thành công
     */
    it('TC-BS-LK-HS-04 - should update diagnosis for an active visit', async () => {
        // 1. Setup
        (medicalRecordDao.findMedicalRecordById as jest.Mock).mockResolvedValue({ id: recordId, visitId, doctorId });
        (visitDao.findVisitById as jest.Mock).mockResolvedValue({ id: visitId, status: 'in_progress' });
        (medicalRecordDao.updateMedicalRecord as jest.Mock).mockResolvedValue({ id: recordId, diagnosis: 'Updated' });

        const updateData = { diagnosis: 'Updated' };

        // 2. Action
        const result = await medicalRecordService.updateMedicalRecord(recordId, doctorId, updateData as any);

        // 3. Verification
        expect(result.diagnosis).toBe('Updated');
        expect(medicalRecordDao.updateMedicalRecord).toHaveBeenCalledWith(recordId, updateData);
    });

    /**
     * TC-BS-LK-HS-05: Chặn cập nhật tiêu đề/chẩn đoán khi lượt khám đã kết thúc (Audit Gap Check)
     */
    it('TC-BS-LK-HS-05 - should throw BAD_REQUEST if trying to update record of a COMPLETED visit', async () => {
        (medicalRecordDao.findMedicalRecordById as jest.Mock).mockResolvedValue({ id: recordId, visitId, doctorId });
        (visitDao.findVisitById as jest.Mock).mockResolvedValue({ id: visitId, status: 'completed' });

        await expect(medicalRecordService.updateMedicalRecord(recordId, doctorId, { diagnosis: 'Hack' } as any))
            .rejects.toMatchObject({ 
                type: ErrorType.BAD_REQUEST,
                // message: expect.stringContaining('completed') 
            });
    });
});
