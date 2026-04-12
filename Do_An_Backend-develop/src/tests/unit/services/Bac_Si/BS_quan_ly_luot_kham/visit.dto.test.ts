import { createVisitDto, CompleteVisitDto, CancelVisitDto, searchVisitsDto } from '@src/dtos/visit.dto';

describe('Visit DTO Validation (Doctor Role)', () => {

    // =========================================================================
    // 1. createVisitDto
    // =========================================================================
    describe('createVisitDto', () => {
        /**
         * TC-BS-LK-DTO-01: Dữ liệu tạo lượt khám hợp lệ
         */
        it('TC-BS-LK-DTO-01 - should validate valid creation data', () => {
            const validData = {
                patientUserId: '550e8400-e29b-41d4-a716-446655440000',
                doctorId: '550e8400-e29b-41d4-a716-446655440001',
                type: 'new',
                status: 'waiting',
                startTime: new Date().toISOString()
            };
            const result = createVisitDto.safeParse(validData);
            expect(result.success).toBe(true);
        });

        /**
         * TC-BS-LK-DTO-02: Lỗi khi thiếu patientUserId
         */
        it('TC-BS-LK-DTO-02 - should fail if patientUserId is missing', () => {
            const invalidData = { doctorId: '550e8400-e29b-41d4-a716-446655440001' };
            const result = createVisitDto.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        /**
         * TC-BS-LK-DTO-03: Lỗi khi định dạng UUID sai
         */
        it('TC-BS-LK-DTO-03 - should fail if IDs are not valid UUIDs', () => {
            const invalidData = { 
                patientUserId: 'invalid-id',
                doctorId: '550e8400-e29b-41d4-a716-446655440001' 
            };
            const result = createVisitDto.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    // =========================================================================
    // 2. CompleteVisitDto & CancelVisitDto
    // =========================================================================
    describe('Complete & Cancel DTOs', () => {
        it('TC-BS-LK-DTO-04 - CompleteVisitDto should allow optional notes', () => {
            expect(CompleteVisitDto.safeParse({ notes: 'Patient recovered' }).success).toBe(true);
            expect(CompleteVisitDto.safeParse({}).success).toBe(true);
        });

        it('TC-BS-LK-DTO-05 - CancelVisitDto should require a reason', () => {
            expect(CancelVisitDto.safeParse({ reason: 'Patient did not show up' }).success).toBe(true);
            expect(CancelVisitDto.safeParse({}).success).toBe(false);
            expect(CancelVisitDto.safeParse({ reason: '' }).success).toBe(false);
        });
    });

    // =========================================================================
    // 3. searchVisitsDto
    // =========================================================================
    describe('searchVisitsDto', () => {
        it('TC-BS-LK-DTO-06 - should validate search filters', () => {
            const validQuery = {
                patientId: '550e8400-e29b-41d4-a716-446655440000',
                fromDate: '2024-01-01',
                toDate: '2024-12-31',
                status: 'completed'
            };
            const result = searchVisitsDto.safeParse(validQuery);
            expect(result.success).toBe(true);
        });

        it('TC-BS-LK-DTO-07 - should fail if fromDate > toDate', () => {
            const invalidQuery = {
                patientId: '550e8400-e29b-41d4-a716-446655440000',
                fromDate: '2024-12-31',
                toDate: '2024-01-01'
            };
            const result = searchVisitsDto.safeParse(invalidQuery);
            expect(result.success).toBe(false);
        });
    });
});
