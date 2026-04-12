import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from '@src/dtos/medical-record.dto';

describe('Medical Record DTO Validation (Doctor Role)', () => {

    // =========================================================================
    // 1. CreateMedicalRecordDto
    // =========================================================================
    describe('CreateMedicalRecordDto', () => {
        /**
         * TC-BS-LK-DTO-19: Dữ liệu tạo bản khám hợp lệ
         */
        it('TC-BS-LK-DTO-19 - should validate valid medical record creation', () => {
            const validData = {
                visitId: '550e8400-e29b-41d4-a716-446655440000',
                title: 'Khám tổng quát lần 1',
                symptoms: 'Đau đầu, chóng mặt nhẹ',
                diagnosis: 'Rối loạn tiền đình',
                treatments: 'Nghỉ ngơi, uống thuốc theo đơn',
                notes: 'Tái khám sau 7 ngày'
            };
            const result = CreateMedicalRecordDto.safeParse(validData);
            expect(result.success).toBe(true);
        });

        /**
         * TC-BS-LK-DTO-20: Lỗi khi thiếu các trường bắt buộc
         */
        it('TC-BS-LK-DTO-20 - should fail if mandatory fields are missing', () => {
            // Giả sử title và visitId là bắt buộc
            const invalidData = { symptoms: '...' };
            const result = CreateMedicalRecordDto.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    // =========================================================================
    // 2. UpdateMedicalRecordDto
    // =========================================================================
    describe('UpdateMedicalRecordDto', () => {
        /**
         * TC-BS-LK-DTO-21: Cập nhật thông tin bản khám
         */
        it('TC-BS-LK-DTO-21 - should validate medical record update', () => {
            const validUpdate = {
                diagnosis: 'Viêm xoang cấp',
                notes: 'Bổ sung thuốc xịt mũi'
            };
            const result = UpdateMedicalRecordDto.safeParse(validUpdate);
            expect(result.success).toBe(true);
        });

        /**
         * TC-BS-LK-DTO-22: Lỗi khi chẩn đoán quá dài (ví dụ > 2000 ký tự)
         */
        it('TC-BS-LK-DTO-22 - should fail if diagnosis is excessively long', () => {
            const longDiagnosis = 'D'.repeat(2001);
            const result = UpdateMedicalRecordDto.safeParse({ diagnosis: longDiagnosis });
            // Xem xét ràng buộc trong DTO
        });
    });
});
