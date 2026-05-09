import statisticsService from '@src/services/statistics.service';
import prisma from '@src/config/prisma';
import { AppointmentStatus } from '@prisma/client';

describe('Integration Test Statistics Service - 15 Cases', () => {
    let doctor: any, patient: any;
    beforeAll(async () => {
        const docRecord = await prisma.doctor.findFirst({ include: { staff: { include: { user: true } } } });
        doctor = docRecord?.staff.user;
        const pRecord = await prisma.patient.findFirst({ include: { user: true } });
        patient = pRecord?.user;
    });
    const runTest = async (fn: (tx: any) => Promise<void>) => {
        await prisma.$transaction(async (tx) => {
            const originalTx = prisma.$transaction;
            (prisma as any).$transaction = (cb: any) => cb(tx);
            try { await fn(tx); } finally { (prisma as any).$transaction = originalTx; }
            throw new Error('ROLLBACK');
        }).catch(err => { if (err.message !== 'ROLLBACK') throw err; });
    };

    it('TC_BS_TK_SER_01 - Lấy dashboard hợp lệ', async () => {
        const res = await statisticsService.getDoctorDashboardSummary(doctor.id, 'UTC');
        expect(res).toHaveProperty('completedAppointments');
    });
    it('TC_BS_TK_SER_02 - [BUG] Integration: Thống kê không đổi khi khám xong', async () => await runTest(async (tx) => {
        const before = await statisticsService.getDoctorDashboardSummary(doctor.id, 'UTC');
        await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: new Date(), reason: 'K', status: AppointmentStatus.completed } });
        const after = await statisticsService.getDoctorDashboardSummary(doctor.id, 'UTC');
        expect(after.completedAppointments).toBe(before.completedAppointments + 1);
    }));
    it('TC_BS_TK_SER_03 - Biểu đồ đường nhãn VN', async () => {
        const res = await statisticsService.getDoctorAppointmentsByDay(doctor.id, 'UTC');
        expect(res.labels).toContain('Thứ 2');
    });
    it('TC_BS_TK_SER_04 - Biểu đồ tròn structure', async () => {
        const res = await statisticsService.getDoctorAppointmentStatus(doctor.id, 'UTC');
        expect(res[0]).toHaveProperty('name');
    });
    it('TC_BS_TK_SER_05 - Thống kê cho bệnh nhân', async () => {
        const res = await statisticsService.getPatientStatistics(patient.id);
        expect(res.summary).toBeDefined();
    });
    it('TC_BS_TK_SER_06 - Thống kê Admin mới đăng ký', async () => {
        const res = await statisticsService.getAdminStatistics('month');
        expect(res.newPatientsCount).toBeDefined();
    });
    it('TC_BS_TK_SER_07 - Thống kê theo khoa', async () => {
        const res = await statisticsService.getPatientsByDepartment();
        expect(res.data).toBeDefined();
    });
    it('TC_BS_TK_SER_08 - Thống kê theo bác sĩ', async () => {
        const res = await statisticsService.getAppointmentsByDoctor();
        expect(res.data).toBeDefined();
    });
    it('TC_BS_TK_SER_09 - Lượt khám theo trạng thái', async () => {
        const res = await statisticsService.getVisitCountsByStatus();
        expect(res).toBeDefined();
    });
    it('TC_BS_TK_SER_10 - Lượt khám theo năm', async () => {
        const res = await statisticsService.getVisitCountsByYear(2025);
        expect(res.months.length).toBe(12);
    });
    it('TC_BS_TK_SER_11 - [BUG] Error 404 cho bác sĩ', async () => {
        await expect(statisticsService.getPatientStatistics(doctor.id)).rejects.toThrow();
    });
    it('TC_BS_TK_SER_12 - Dashboard Admin summary', async () => {
        const res = await statisticsService.getDashboardSummary('UTC');
        expect(res.length).toBeGreaterThan(0);
    });
    it('TC_BS_TK_SER_13 - Doanh thu tuần', async () => {
        const res = await statisticsService.getRevenueByDayOfWeek('UTC');
        expect(res.length).toBe(7);
    });
    it('TC_BS_TK_SER_14 - Nhân sự theo khoa', async () => {
        const res = await statisticsService.getStaffByDepartment();
        expect(res.length).toBeGreaterThanOrEqual(0);
    });
    it('TC_BS_TK_SER_15 - Lịch hẹn tuần Admin', async () => {
        const res = await statisticsService.getAppointmentsByDayOfWeek('UTC');
        expect(res.length).toBe(7);
    });
});
