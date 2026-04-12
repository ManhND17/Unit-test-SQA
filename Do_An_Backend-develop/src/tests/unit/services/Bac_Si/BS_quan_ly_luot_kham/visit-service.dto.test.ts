import { CreateServiceUsageDto, UpdateServiceUsageDto, BulkCreateServiceUsageDto } from '@src/dtos/visit-service.dto';

describe('Visit Service DTO Validation (Doctor Role)', () => {

    // =========================================================================
    // 1. CreateServiceUsageDto
    // =========================================================================
    describe('CreateServiceUsageDto', () => {
        /**
         * TC-BS-LK-DTO-08: Dữ liệu chỉ định dịch vụ hợp lệ
         */
        it('TC-BS-LK-DTO-08 - should validate valid service usage data', () => {
            const validData = {
                visitId: '550e8400-e29b-41d4-a716-446655440000',
                medicalServiceId: '550e8400-e29b-41d4-a716-446655440001',
                quantity: 2,
                orderedByUserId: '550e8400-e29b-41d4-a716-446655440002'
            };
            const result = CreateServiceUsageDto.safeParse(validData);
            expect(result.success).toBe(true);
        });

        /**
         * TC-BS-LK-DTO-09: Lỗi khi số lượng âm hoặc bằng 0
         */
        it('TC-BS-LK-DTO-09 - should fail if quantity is less than 1', () => {
            const invalidData = {
                visitId: '550e8400-e29b-41d4-a716-446655440000',
                medicalServiceId: '550e8400-e29b-41d4-a716-446655440001',
                quantity: 0
            };
            const result = CreateServiceUsageDto.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    // =========================================================================
    // 2. UpdateServiceUsageDto
    // =========================================================================
    describe('UpdateServiceUsageDto', () => {
        /**
         * TC-BS-LK-DTO-10: Cập nhật số lượng và trạng thái dịch vụ
         */
        it('TC-BS-LK-DTO-10 - should validate partial update data', () => {
            const validData = {
                quantity: 5,
                status: 'done'
            };
            const result = UpdateServiceUsageDto.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('TC-BS-LK-DTO-11 - should fail with invalid status', () => {
            const result = UpdateServiceUsageDto.safeParse({ status: 'invalid_status' });
            expect(result.success).toBe(false);
        });
    });

    // =========================================================================
    // 3. BulkCreateServiceUsageDto
    // =========================================================================
    describe('BulkCreateServiceUsageDto', () => {
        /**
         * TC-BS-LK-DTO-12: Chỉ định nhiều dịch vụ cùng lúc
         */
        it('TC-BS-LK-DTO-12 - should validate bulk creation items', () => {
            const bulkData = {
                items: [
                    {
                        visitId: '550e8400-e29b-41d4-a716-446655440000',
                        medicalServiceId: '550e8400-e29b-41d4-a716-446655440001',
                        quantity: 1
                    },
                    {
                        visitId: '550e8400-e29b-41d4-a716-446655440000',
                        medicalServiceId: '550e8400-e29b-41d4-a716-446655440002',
                        quantity: 1
                    }
                ]
            };
            const result = BulkCreateServiceUsageDto.safeParse(bulkData);
            expect(result.success).toBe(true);
        });

        it('TC-BS-LK-DTO-13 - should fail if items array is empty', () => {
            const result = BulkCreateServiceUsageDto.safeParse({ items: [] });
            expect(result.success).toBe(false);
        });
    });
});
