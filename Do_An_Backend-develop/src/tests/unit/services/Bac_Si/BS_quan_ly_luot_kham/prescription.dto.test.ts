import { CreatePrescriptionDto, UpdateMedicineUsageDto, BatchAddMedicinesToPrescriptionDto } from '@src/dtos/prescription.dto';

describe('Prescription DTO Validation (Doctor Role)', () => {

    // =========================================================================
    // 1. CreatePrescriptionDto
    // =========================================================================
    describe('CreatePrescriptionDto', () => {
        /**
         * TC-BS-LK-DTO-14: Dữ liệu tạo đơn thuốc hợp lệ
         */
        it('TC-BS-LK-DTO-14 - should validate valid prescription creation', () => {
            const validData = {
                visitId: '550e8400-e29b-41d4-a716-446655440000',
                medicines: [
                    {
                        drugName: 'Paracetamol',
                        quantity: 10,
                        note: 'Take after meals'
                    }
                ]
            };
            const result = CreatePrescriptionDto.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('TC-BS-LK-DTO-15 - should fail if medicine quantity is negative', () => {
            const invalidData = {
                visitId: '550e8400-e29b-41d4-a716-446655440000',
                medicines: [{ drugName: 'P', quantity: -1 }]
            };
            const result = CreatePrescriptionDto.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    // =========================================================================
    // 2. UpdateMedicineUsageDto
    // =========================================================================
    describe('UpdateMedicineUsageDto', () => {
        /**
         * TC-BS-LK-DTO-16: Cập nhật thông tin dùng thuốc
         */
        it('TC-BS-LK-DTO-16 - should validate medicine usage update', () => {
            const validData = {
                medicineId: '550e8400-e29b-41d4-a716-446655440001',
                quantity: 5,
                note: 'Twice a day'
            };
            const result = UpdateMedicineUsageDto.safeParse(validData);
            expect(result.success).toBe(true);
        });
    });

    // =========================================================================
    // 3. BatchAddMedicinesToPrescriptionDto
    // =========================================================================
    describe('BatchAddMedicinesToPrescriptionDto', () => {
        /**
         * TC-BS-LK-DTO-17: Thêm nhiều thuốc vào đơn thuốc hiện có
         */
        it('TC-BS-LK-DTO-17 - should validate batch medicine addition', () => {
            const batchData = {
                prescriptionId: '550e8400-e29b-41d4-a716-446655440000',
                medicines: [
                    { drugName: 'Drug A', quantity: 1, price: 100 },
                    { drugName: 'Drug B', quantity: 2, price: 200 }
                ]
            };
            const result = BatchAddMedicinesToPrescriptionDto.safeParse(batchData);
            expect(result.success).toBe(true);
        });

        it('TC-BS-LK-DTO-18 - should fail if more than 50 medicines are added in one batch', () => {
            const tooManyMedicines = Array(51).fill({ drugName: 'D', quantity: 1 });
            const result = BatchAddMedicinesToPrescriptionDto.safeParse({
                prescriptionId: '550e8400-e29b-41d4-a716-446655440000',
                medicines: tooManyMedicines
            });
            expect(result.success).toBe(false);
        });
    });
});
