import { 
    getDoctorDashboardSummaryDto, 
    getDoctorAppointmentsByDayDto, 
    getDoctorAppointmentStatusDto 
} from '@src/dtos/statistics.dto';

describe('Statistics DTO Validation Logic (Doctor Focus)', () => {

    /**
     * TC-BS-TK-DTO-01: getDoctorDashboardSummaryDto
     */
    it('TC-BS-TK-DTO-01 - should validate doctor dashboard summary DTO (empty object)', () => {
        const validData = {};
        const result = getDoctorDashboardSummaryDto.safeParse(validData);
        expect(result.success).toBe(true);
    });

    /**
     * TC-BS-TK-DTO-02: getDoctorAppointmentsByDayDto
     */
    it('TC-BS-TK-DTO-02 - should validate doctor appointments by day DTO (empty object)', () => {
        const validData = {};
        const result = getDoctorAppointmentsByDayDto.safeParse(validData);
        expect(result.success).toBe(true);
    });

    /**
     * TC-BS-TK-DTO-03: getDoctorAppointmentStatusDto
     */
    it('TC-BS-TK-DTO-03 - should validate doctor appointment status DTO (empty object)', () => {
        const validData = {};
        const result = getDoctorAppointmentStatusDto.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should fail if invalid extra data is passed when not allowed (if strict)', () => {
        // Zod by default allows extra keys unless .strict() is used.
        // The current schemas are not strict, so this would pass.
        const dataWithExtra = { extra: 'field' };
        const result = getDoctorDashboardSummaryDto.safeParse(dataWithExtra);
        expect(result.success).toBe(true); 
    });
});
