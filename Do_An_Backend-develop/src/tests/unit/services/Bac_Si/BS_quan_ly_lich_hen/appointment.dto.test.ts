import { ApproveAppointmentSchema, RejectAppointmentSchema, GetAvailableSlotsQuerySchema } from '@src/dtos/appointment.dto';

describe('Appointment DTO Validation Logic', () => {
    
    // =========================================================================
    // 1. ApproveAppointmentSchema
    // =========================================================================
    describe('ApproveAppointmentSchema', () => {
        /**
         * TC-BS-LH-DTO-01: Valid Approve data
         */
        it('TC-BS-LH-DTO-01 - should validate valid approval data', () => {
            const validData = { notes: 'Bác sĩ đã xem và đồng ý.' };
            const result = ApproveAppointmentSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should validate approval data with empty notes', () => {
            const validData = {};
            const result = ApproveAppointmentSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should fail if notes are too long', () => {
            const invalidData = { notes: 'a'.repeat(1001) };
            const result = ApproveAppointmentSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    // =========================================================================
    // 2. RejectAppointmentSchema
    // =========================================================================
    describe('RejectAppointmentSchema', () => {
        /**
         * TC-BS-LH-DTO-02: Valid Reject data (min 10 chars for reason)
         */
        it('TC-BS-LH-DTO-02 - should validate valid rejection data', () => {
            const validData = { reasonCancel: 'Bác sĩ bận lịch phẫu thuật đột xuất.' };
            const result = RejectAppointmentSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should fail if reasonCancel is shorter than 10 characters', () => {
            const invalidData = { reasonCancel: 'Quá bận' };
            const result = RejectAppointmentSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should fail if reasonCancel is missing', () => {
            const invalidData = {};
            const result = RejectAppointmentSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    // =========================================================================
    // 3. Date Validation Logic (isValidDate & notInPast)
    // =========================================================================
    describe('Date Validation (isValidDate & notInPast)', () => {
        const doctorId = 'f1b9f71c-4b6e-4458-a536-419b67482fb1';

        /**
         * TC-BS-LH-DTO-03: Date logic validation
         */
        it('TC-BS-LH-DTO-03 - should validate current or future date', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);
            const dateStr = futureDate.toISOString().split('T')[0];

            const validQuery = { doctorId, date: dateStr };
            const result = GetAvailableSlotsQuerySchema.safeParse(validQuery);
            expect(result.success).toBe(true);
        });

        it('should fail for past date (notInPast logic)', () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 2);
            const dateStr = pastDate.toISOString().split('T')[0];

            const invalidQuery = { doctorId, date: dateStr };
            const result = GetAvailableSlotsQuerySchema.safeParse(invalidQuery);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('Ngày không được trong quá khứ');
            }
        });

        it('should fail for invalid date string (isValidDate logic)', () => {
            const invalidQuery = { doctorId, date: 'not-a-date' };
            const result = GetAvailableSlotsQuerySchema.safeParse(invalidQuery);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('Ngày không hợp lệ');
            }
        });
    });
});
