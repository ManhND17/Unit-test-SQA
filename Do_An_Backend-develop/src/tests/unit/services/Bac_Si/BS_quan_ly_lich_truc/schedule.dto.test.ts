import { CreateScheduleSchema, UpdateScheduleSchema } from '@src/dtos/schedule.dto';

describe('Schedule DTO Validation Logic (Doctor Focus)', () => {

    // =========================================================================
    // 1. CreateScheduleSchema
    // =========================================================================
    describe('CreateScheduleSchema', () => {
        const validBaseData = {
            staffId: 'user-1',
            departmentId: 1,
            type: 'work',
            roomId: 'room-1',
            date: '2025-01-01',
            startTime: '2025-01-01T08:00:00Z',
            endTime: '2025-01-01T17:00:00Z',
            maxSlot: 10
        };

        /**
         * TC-BS-LT-DTO-01: Valid Create data
         */
        it('TC-BS-LT-DTO-01 - should validate valid creation data', () => {
            const result = CreateScheduleSchema.safeParse(validBaseData);
            expect(result.success).toBe(true);
        });

        /**
         * TC-BS-LT-DTO-02: Failure - endTime <= startTime
         */
        it('TC-BS-LT-DTO-02 - should fail if endTime is before or equal to startTime', () => {
            const invalidData = { 
                ...validBaseData, 
                startTime: '2025-01-01T10:00:00Z', 
                endTime: '2025-01-01T09:00:00Z' 
            };
            const result = CreateScheduleSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('Thời gian kết thúc phải lớn hơn thời gian bắt đầu');
            }
        });

        /**
         * TC-BS-LT-DTO-03: Failure - Invalid date format
         */
        it('TC-BS-LT-DTO-03 - should fail if date format is invalid', () => {
            const invalidData = { ...validBaseData, date: 'invalid-date' };
            const result = CreateScheduleSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        /**
         * TC-BS-LT-DTO-04: Failure - Negative maxSlot
         */
        it('TC-BS-LT-DTO-04 - should fail if maxSlot is negative', () => {
            const invalidData = { ...validBaseData, maxSlot: -1 };
            const result = CreateScheduleSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        /**
         * TC-BS-LT-DTO-05: Failure - Missing mandatory fields
         */
        it('TC-BS-LT-DTO-05 - should fail if mandatory fields are missing', () => {
            const invalidData = { type: 'work' }; // Missing staffId, departmentId, etc.
            const result = CreateScheduleSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    // =========================================================================
    // 2. UpdateScheduleSchema
    // =========================================================================
    describe('UpdateScheduleSchema', () => {
        /**
         * TC-BS-LT-DTO-06: Valid Update data
         */
        it('TC-BS-LT-DTO-06 - should validate valid partial update data', () => {
            const validData = { id: 'sch-1', notes: 'Updated notes' };
            const result = UpdateScheduleSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        /**
         * TC-BS-LT-DTO-07: Failure - Missing ID in update
         */
        it('TC-BS-LT-DTO-07 - should fail if id is missing in update', () => {
            const invalidData = { notes: 'No ID here' };
            const result = UpdateScheduleSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        /**
         * TC-BS-LT-DTO-08: Failure - Invalid UUID for ID
         */
        it('TC-BS-LT-DTO-08 - should fail if id is empty string', () => {
            const invalidData = { id: '', notes: 'Empty ID' };
            const result = UpdateScheduleSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });
});
