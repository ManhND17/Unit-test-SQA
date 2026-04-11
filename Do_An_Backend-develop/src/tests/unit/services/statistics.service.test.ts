import statisticsService from '@src/services/statistics.service';
import * as statisticsDao from '@src/daos/statistics.dao';
import visitDao from '@src/daos/visit.dao';
import prisma from '@src/config/prisma';
import { CustomError, ErrorType } from '@src/core/Error';

// Mock các dependencies
jest.mock('@src/daos/statistics.dao');
jest.mock('@src/daos/visit.dao');
jest.mock('@src/config/prisma', () => ({
    __esModule: true,
    default: {
        patient: {
            findUnique: jest.fn(),
        },
    },
}));

describe('Statistics Service Unit Tests', () => {
    const userId = 'user-1';

    beforeEach(() => {
        // [Rollback]: Đảm bảo trạng thái mock sạch sẽ
        jest.clearAllMocks();
    });

    // =========================================================================
    // 1. getPatientStatistics
    // =========================================================================
    describe('getPatientStatistics', () => {
        /**
         * TC-STA-01: Lấy thống kê của bệnh nhân thành công
         */
        it('TC-STA-01 - should return statistics for valid patient', async () => {
            // 1. Setup
            (prisma.patient.findUnique as jest.Mock).mockResolvedValue({ userId });
            (statisticsDao.countCompletedAppointments as jest.Mock).mockResolvedValue(5);
            (statisticsDao.countUpcomingAppointments as jest.Mock).mockResolvedValue(2);

            // 2. Action
            const result = await statisticsService.getPatientStatistics(userId);

            // 3. Verification (CheckDB)
            expect(result.summary.totalCompletedAppointments).toBe(5);
            expect(prisma.patient.findUnique).toHaveBeenCalled();
        });

        /**
         * TC-STA-02: Lấy thống kê thất bại do bệnh nhân không tồn tại
         */
        it('TC-STA-02 - should throw NOT_FOUND for non-existent patient', async () => {
            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(statisticsService.getPatientStatistics(userId))
                .rejects.toMatchObject({ type: ErrorType.NOT_FOUND });
        });
    });

    // =========================================================================
    // 2. getAdminStatistics
    // =========================================================================
    describe('getAdminStatistics', () => {
        /**
         * TC-STA-03: Lấy thống kê Admin thành công (theo tháng)
         */
        it('TC-STA-03 - should return admin statistics for month period', async () => {
            (statisticsDao.countNewPatients as jest.Mock).mockResolvedValue(10);
            (statisticsDao.countPatientsByMonth as jest.Mock).mockResolvedValue([{ month: '2025-01', count: 5 }]);

            const result = await statisticsService.getAdminStatistics('month');

            expect(result.newPatientsCount).toBe(10);
            expect(result.patientVisits.total).toBe(5);
        });
    });

    // =========================================================================
    // 4. Doctor Dashboard & Consistency
    // =========================================================================
    describe('Doctor Dashboard Consistency Checks', () => {
        const doctorId = 'doc-123';
        const timezone = 'Asia/Ho_Chi_Minh';

        /**
         * TC-STA-05: Đối chiếu tổng số lịch hẹn và ca khám Hoàn thành
         */
        it('TC-STA-05 - completed appointments should match completed visits', async () => {
            // Setup: 10 completed appointments
            (statisticsDao.getDoctorDashboardSummary as jest.Mock).mockResolvedValue({
                completedAppointments: 10,
                pendingAppointments: 5,
                weeklyAppointments: 15
            });
            // Setup: 10 completed visits
            (visitDao.getVisitCountsByStatus as jest.Mock).mockResolvedValue({
                total: 10,
                byStatus: { 'completed': 10 }
            });

            const summary = await statisticsService.getDoctorDashboardSummary(doctorId, timezone);
            const visitStats = await statisticsService.getVisitCountsByStatus(undefined, undefined, timezone);

            expect(summary.completedAppointments).toBe(visitStats.byStatus['completed']);
        });

        /**
         * TC-STA-06: Đối chiếu số lượng lịch hẹn và ca khám bị Hủy
         */
        it('TC-STA-06 - cancelled appointments should match cancelled visits', async () => {
            // Setup: 3 cancelled appointments this week
            (statisticsDao.getDoctorAppointmentStatus as jest.Mock).mockResolvedValue([
                { name: 'Hoàn thành', value: 10 },
                { name: 'Hủy', value: 3 },
                { name: 'Chờ khám', value: 5 }
            ]);
            // Setup: 3 cancelled visits
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
         * TC-STA-07: Đối chiếu số ca khám và lịch hẹn theo ngày (Daily Consistency)
         */
        it('TC-STA-07 - daily appointments should match daily visits', async () => {
            const mockDailyApps = { labels: ['Thứ 2'], values: [5] };
            (statisticsDao.getDoctorAppointmentsByDay as jest.Mock).mockResolvedValue(mockDailyApps);

            // Giả sử có 5 ca khám trong ngày đó
            (visitDao.getVisitCountsByStatus as jest.Mock).mockResolvedValue({
                total: 5,
                byStatus: { 'completed': 5 }
            });

            const dailyApps = await statisticsService.getDoctorAppointmentsByDay(doctorId, timezone);
            const dailyVisits = await statisticsService.getVisitCountsByStatus('2025-01-01', '2025-01-01', timezone);

            expect(dailyApps.values[0]).toBe(dailyVisits.total);
        });

        /**
         * TC-STA-08: Kiểm tra thống kê doanh thu của Bác sĩ
         */
        it('TC-STA-08 - should return correct revenue statistics for doctor', async () => {
            const mockRevenue = [
                { day: 'Thứ 2', value: 1000000 },
                { day: 'Thứ 3', value: 1500000 }
            ];
            (statisticsDao.getRevenueByDayOfWeek as jest.Mock).mockResolvedValue(mockRevenue);

            const result = await statisticsService.getRevenueByDayOfWeek(timezone);

            expect(result).toHaveLength(2);
            expect(result[0].value).toBe(1000000);
            expect(statisticsDao.getRevenueByDayOfWeek).toHaveBeenCalled();
        });
    });
});
