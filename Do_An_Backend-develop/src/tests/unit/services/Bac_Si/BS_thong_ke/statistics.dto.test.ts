import { 
    getDoctorDashboardSummaryDto, 
    getDoctorAppointmentsByDayDto, 
    getDoctorAppointmentStatusDto,
    getAdminStatisticsDto,
    getPatientsByDepartmentDto,
    getAppointmentsByDoctorDto,
    getRevenueByDayOfWeekDto,
    getVisitCountsByYearDto
} from '@src/dtos/statistics.dto';

describe('Unit Test Statistics DTO - 15 Cases', () => {
    it('TC_BS_TK_DTO_01 - Chấp nhận period week', () => expect(getAdminStatisticsDto.safeParse({ period: 'week' }).success).toBe(true));
    it('TC_BS_TK_DTO_02 - Chấp nhận period month', () => expect(getAdminStatisticsDto.safeParse({ period: 'month' }).success).toBe(true));
    it('TC_BS_TK_DTO_03 - Thất bại khi period là "year"', () => expect(getAdminStatisticsDto.safeParse({ period: 'year' }).success).toBe(false));
    it('TC_BS_TK_DTO_04 - Chấp nhận fromDate hợp lệ', () => expect(getAdminStatisticsDto.safeParse({ fromDate: '2025-05-01' }).success).toBe(true));
    it('TC_BS_TK_DTO_05 - Thất bại khi toDate sai định dạng', () => expect(getAdminStatisticsDto.safeParse({ toDate: '31/12/2025' }).success).toBe(false));
    it('TC_BS_TK_DTO_06 - Chấp nhận specialization chuỗi', () => expect(getAppointmentsByDoctorDto.safeParse({ specialization: 'Tim mạch' }).success).toBe(true));
    it('TC_BS_TK_DTO_07 - Thất bại khi specialization là số', () => expect(getAppointmentsByDoctorDto.safeParse({ specialization: 123 }).success).toBe(false));
    it('TC_BS_TK_DTO_08 - Chấp nhận weekStart hợp lệ', () => expect(getRevenueByDayOfWeekDto.safeParse({ weekStart: '2025-05-05' }).success).toBe(true));
    it('TC_BS_TK_DTO_09 - Thất bại khi weekStart sai ngày', () => expect(getRevenueByDayOfWeekDto.safeParse({ weekStart: '2025-13-01' }).success).toBe(false));
    it('TC_BS_TK_DTO_10 - Chấp nhận year 2026', () => expect(getVisitCountsByYearDto.safeParse({ year: 2026 }).success).toBe(true));
    it('TC_BS_TK_DTO_11 - Thất bại khi year là chuỗi', () => expect(getVisitCountsByYearDto.safeParse({ year: '2026' }).success).toBe(false));
    it('TC_BS_TK_DTO_12 - Thất bại khi year = 0', () => expect(getVisitCountsByYearDto.safeParse({ year: 0 }).success).toBe(false));
    it('TC_BS_TK_DTO_13 - Chấp nhận object rỗng cho Dashboard', () => expect(getDoctorDashboardSummaryDto.safeParse({}).success).toBe(true));
    it('TC_BS_TK_DTO_14 - Chấp nhận object rỗng cho AppByDay', () => expect(getDoctorAppointmentsByDayDto.safeParse({}).success).toBe(true));
    it('TC_BS_TK_DTO_15 - Chấp nhận object rỗng cho AppStatus', () => expect(getDoctorAppointmentStatusDto.safeParse({}).success).toBe(true));
});
