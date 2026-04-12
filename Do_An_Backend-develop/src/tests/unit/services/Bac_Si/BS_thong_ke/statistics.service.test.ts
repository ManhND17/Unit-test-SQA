import statisticsService from '@src/services/statistics.service';
import * as statisticsDao from '@src/daos/statistics.dao';
import visitDao from '@src/daos/visit.dao';

// Mock các dependencies
jest.mock('@src/daos/statistics.dao');
jest.mock('@src/daos/visit.dao');
jest.mock('@src/config/prisma');

describe('Statistics Service Unit Tests (Doctor Dashboard Focus)', () => {
    const doctorId = 'doc-123';
    const timezone = 'Asia/Ho_Chi_Minh';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // =========================================================================
    // Doctor Dashboard & Consistency
    // =========================================================================
    describe('Doctor Dashboard Statistics', () => {
        
        /**
         * TC-BS-TK-01: Kiểm tra tính nhất quán giữa Lịch hẹn và Ca khám Hoàn thành
         */
        it('TC-BS-TK-01 - completed appointments should match completed visits', async () => {
            (statisticsDao.getDoctorDashboardSummary as jest.Mock).mockResolvedValue({
                completedAppointments: 10,
                pendingAppointments: 5,
                weeklyAppointments: 15
            });
            (visitDao.getVisitCountsByStatus as jest.Mock).mockResolvedValue({
                total: 10,
                byStatus: { 'completed': 10 }
            });

            const summary = await statisticsService.getDoctorDashboardSummary(doctorId, timezone);
            const visitStats = await statisticsService.getVisitCountsByStatus(undefined, undefined, timezone);

            expect(summary.completedAppointments).toBe(visitStats.byStatus['completed']);
        });

        /**
         * TC-BS-TK-02: Kiểm tra tính nhất quán giữa Lịch hẹn và Ca khám bị Hủy
         */
        it('TC-BS-TK-02 - cancelled appointments should match cancelled visits', async () => {
            (statisticsDao.getDoctorAppointmentStatus as jest.Mock).mockResolvedValue([
                { name: 'Hoàn thành', value: 10 },
                { name: 'Hủy', value: 3 },
                { name: 'Chờ khám', value: 5 }
            ]);
            (visitDao.getVisitCountsByStatus as jest.Mock).mockResolvedValue({
                total: 18,
                byStatus: { 'completed': 10, 'cancelled': 3, 'in_progress': 5 }
            });

            const statusStats = await statisticsService.getDoctorAppointmentStatus(doctorId, timezone);
            const visitStats = await statisticsService.getVisitCountsByStatus(undefined, undefined, timezone);

            const cancelledApp = statusStats.find(s => s.name === 'Hủy')?.value;
            expect(cancelledApp).toBe(visitStats.byStatus['cancelled']);
        });

        /**
         * TC-BS-TK-03: Đối chiếu số lượng lịch hẹn và ca khám theo ngày (Daily Consistency)
         */
        it('TC-BS-TK-03 - daily appointments should match daily visits', async () => {
            const mockDailyApps = { labels: ['Thứ 2'], values: [5] };
            (statisticsDao.getDoctorAppointmentsByDay as jest.Mock).mockResolvedValue(mockDailyApps);
            (visitDao.getVisitCountsByStatus as jest.Mock).mockResolvedValue({
                total: 5,
                byStatus: { 'completed': 5 }
            });

            const dailyApps = await statisticsService.getDoctorAppointmentsByDay(doctorId, timezone);
            const dailyVisits = await statisticsService.getVisitCountsByStatus('2025-01-01', '2025-01-01', timezone);

            expect(dailyApps.values[0]).toBe(dailyVisits.total);
        });

        /**
         * TC-BS-TK-04: Lấy thống kê trạng thái lịch hẹn của bác sĩ
         */
        it('TC-BS-TK-04 - should return doctor appointment status stats', async () => {
            const mockStatus = [
                { name: 'Hoàn thành', value: 10 },
                { name: 'Hủy', value: 3 }
            ];
            (statisticsDao.getDoctorAppointmentStatus as jest.Mock).mockResolvedValue(mockStatus);

            const result = await statisticsService.getDoctorAppointmentStatus(doctorId, timezone);

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('Hoàn thành');
            expect(statisticsDao.getDoctorAppointmentStatus).toHaveBeenCalledWith(doctorId, timezone);
        });
    });
});
