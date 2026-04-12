import medicalRecordService from '@src/services/medical-record.service';
import * as medicalRecordDao from '@src/daos/medical-record.dao';
import * as visitDao from '@src/daos/visit.dao';
import { CustomError, ErrorType } from '@src/core/Error';

// Mock các dependencies
jest.mock('@src/daos/medical-record.dao');
jest.mock('@src/daos/visit.dao');
jest.mock('@src/services/cloudinary.service');
jest.mock('@src/daos/fileAsset.dao');

describe('Medical Record Service - Creation (Doctor Role)', () => {
    const doctorId = 'doctor-1';
    const visitId = 'visit-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TC-BS-LK-HS-01: Tạo bản khám mới thành công
     */
    it('TC-BS-LK-HS-01 - should create a medical record for an active visit', async () => {
        // 1. Setup
        (visitDao.findVisitById as jest.Mock).mockResolvedValue({ id: visitId, doctorId, status: 'in_progress' });
        (medicalRecordDao.createMedicalRecord as jest.Mock).mockResolvedValue({ id: 'mr-1', visitId });

        const data = {
            visitId,
            title: 'Initial Exam',
            symptoms: 'Fever',
            diagnosis: 'Pending',
            treatments: 'Rest'
        };

        // 2. Action
        const result = await medicalRecordService.createMedicalRecord(doctorId, data as any);

        // 3. Verification
        expect(result.id).toBe('mr-1');
        expect(medicalRecordDao.createMedicalRecord).toHaveBeenCalledWith(doctorId, data);
    });

    /**
     * TC-BS-LK-HS-02: Thất bại khi tạo bản khám cho bác sĩ khác
     */
    it('TC-BS-LK-HS-02 - should throw FORBIDDEN if doctor is not assigned to the visit', async () => {
        (visitDao.findVisitById as jest.Mock).mockResolvedValue({ id: visitId, doctorId: 'other-doctor', status: 'in_progress' });

        await expect(medicalRecordService.createMedicalRecord(doctorId, { visitId } as any))
            .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
    });

    /**
     * TC-BS-LK-HS-03: Thất bại khi tạo bản khám cho lượt khám đã kết thúc (Audit Gap)
     */
    it('TC-BS-LK-HS-03 - should throw BAD_REQUEST if visit is already completed', async () => {
        (visitDao.findVisitById as jest.Mock).mockResolvedValue({ id: visitId, doctorId, status: 'completed' });

        await expect(medicalRecordService.createMedicalRecord(doctorId, { visitId } as any))
            .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
    });
});
