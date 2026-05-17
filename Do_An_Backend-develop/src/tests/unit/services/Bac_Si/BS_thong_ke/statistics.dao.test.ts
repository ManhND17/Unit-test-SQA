import { getDoctorDashboardSummary, getDoctorAppointmentsByDay, getDoctorAppointmentStatus, getMondayOfWeek, countNewPatients, countPatientsByMonth, getStaffCountByDepartment } from '@src/daos/statistics.dao';
import prisma from '@src/config/prisma';
import { AppointmentStatus } from '@prisma/client';
import { DateTime } from 'luxon';

describe('Integration Test Statistics DAO - 20 Cases', () => {
    let doctor: any, patient: any;

    beforeAll(async () => {
        const docRecord = await prisma.doctor.findFirst({ include: { staff: { include: { user: true } } } });
        doctor = docRecord?.staff.user;
        const pRecord = await prisma.patient.findFirst({ include: { user: true } });
        patient = pRecord?.user;
    });

    const runTest = async (fn: (tx: any) => Promise<void>) => {
        await prisma.$transaction(async (tx) => {
            const originals: any = {};
            const modelNames = Object.keys(prisma).filter(key => 
                typeof (prisma as any)[key] === 'object' && (prisma as any)[key] !== null && (tx as any)[key]
            );

            // Swap to tx models
            modelNames.forEach(name => {
                originals[name] = (prisma as any)[name];
                (prisma as any)[name] = (tx as any)[name];
            });

            try {
                await fn(tx);
            } finally {
                // Restore original models
                modelNames.forEach(name => {
                    (prisma as any)[name] = originals[name];
                });
            }
            throw new Error('ROLLBACK');
        }).catch(err => { if (err.message !== 'ROLLBACK') throw err; });
    };

    it('TC_BS_TK_DAO_01 - Đếm ca hoàn thành', async () => await runTest(async (tx) => {
        await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: new Date(), reason: 'T', status: AppointmentStatus.completed } });
        const res = await getDoctorDashboardSummary(doctor.id, 'UTC');
        expect(res.completedAppointments).toBeGreaterThan(0);
    }));

    it('TC_BS_TK_DAO_02 - Ca tuần không tính Rejected', async () => await runTest(async (tx) => {
        const mon = getMondayOfWeek('UTC');
        await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: mon, reason: 'R', status: AppointmentStatus.rejected } });
        const res = await getDoctorDashboardSummary(doctor.id, 'UTC');
        expect(res.weeklyAppointments).toBe(0);
    }));

    it('TC_BS_TK_DAO_03 - Biểu đồ đường không tính Hủy', async () => await runTest(async (tx) => {
        const mon = getMondayOfWeek('UTC');
        await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: mon, reason: 'C', status: AppointmentStatus.cancelled } });
        const res = await getDoctorAppointmentsByDay(doctor.id, 'UTC');
        expect(res.values.reduce((a:any, b:any) => a + b, 0)).toBe(0);
    }));

    it('TC_BS_TK_DAO_04 - Biểu đồ tròn thiếu Rejected', async () => await runTest(async (tx) => {
        const res = await getDoctorAppointmentStatus(doctor.id, 'UTC');
        const hasRejected = res.some((i:any) => i.name.toLowerCase().includes('rejected') || i.name.toLowerCase().includes('từ chối'));
        expect(hasRejected).toBe(true);
    }));

    it('TC_BS_TK_DAO_05 - Lệch múi giờ Chủ Nhật', async () => await runTest(async (tx) => {
        const mon = getMondayOfWeek('UTC');
        const sun = DateTime.fromJSDate(mon).plus({ days: 6 }).set({ hour: 23 }).toJSDate();
        await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: sun, reason: 'S', status: AppointmentStatus.confirmed } });
        const res = await getDoctorDashboardSummary(doctor.id, 'UTC');
        expect(res.weeklyAppointments).toBe(1);
    }));

    it('TC_BS_TK_DAO_06 - Trả về 0 khi bác sĩ không có dữ liệu', async () => {
        const res = await getDoctorDashboardSummary('none', 'UTC');
        expect(res.weeklyAppointments).toBe(0);
    });

    it('TC_BS_TK_DAO_07 - Biểu đồ đường trả về đủ 7 ngày', async () => {
        const res = await getDoctorAppointmentsByDay(doctor.id, 'UTC');
        expect(res.labels.length).toBe(7);
    });

    it('TC_BS_TK_DAO_08 - Đếm bệnh nhân mới đăng ký', async () => {
        const count = await countNewPatients();
        expect(count).toBeGreaterThanOrEqual(0);
    });

    it('TC_BS_TK_DAO_09 - Thống kê bệnh nhân theo tháng', async () => {
        const res = await countPatientsByMonth();
        expect(Array.isArray(res)).toBe(true);
    });

    it('TC_BS_TK_DAO_10 - Thống kê nhân sự theo khoa', async () => {
        const res = await getStaffCountByDepartment();
        expect(res.length).toBeGreaterThanOrEqual(0);
    });

    it('TC_BS_TK_DAO_11 - Boundary: Sáng Thứ 2 đầu tuần', async () => await runTest(async (tx) => {
        const mon = DateTime.fromJSDate(getMondayOfWeek('UTC')).set({ hour: 0, minute: 1 }).toJSDate();
        await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: mon, reason: 'M', status: AppointmentStatus.confirmed } });
        const res = await getDoctorDashboardSummary(doctor.id, 'UTC');
        expect(res.weeklyAppointments).toBe(1);
    }));

    it('TC_BS_TK_DAO_12 - Boundary: Thứ 7 cuối tuần', async () => await runTest(async (tx) => {
        const mon = getMondayOfWeek('UTC');
        const sat = DateTime.fromJSDate(mon).plus({ days: 5 }).toJSDate();
        await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: sat, reason: 'Sat', status: AppointmentStatus.confirmed } });
        const res = await getDoctorDashboardSummary(doctor.id, 'UTC');
        expect(res.weeklyAppointments).toBe(1);
    }));

    it('TC_BS_TK_DAO_13 - Đếm pending + confirmed', async () => await runTest(async (tx) => {
        await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: new Date(), reason: 'C', status: AppointmentStatus.confirmed } });
        const res = await getDoctorDashboardSummary(doctor.id, 'UTC');
        expect(res.pendingAppointments).toBeGreaterThan(0);
    }));

    it('TC_BS_TK_DAO_14 - Kiểm tra ownership bác sĩ', async () => await runTest(async (tx) => {
        await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: new Date(), reason: 'O', status: AppointmentStatus.confirmed } });
        const res = await getDoctorDashboardSummary(doctor.id, 'UTC');
        expect(res.weeklyAppointments).toBeGreaterThan(0);
    }));

    it('TC_BS_TK_DAO_15 - Grouping theo khoa', async () => {
        const res = await getStaffCountByDepartment();
        expect(res[0]).toHaveProperty('department');
    });

    it('TC_BS_TK_DAO_16 - getMondayOfWeek trả về Thứ 2', () => {
        const mon = getMondayOfWeek('UTC');
        expect(new Date(mon).getDay()).toBe(1);
    });

    it('TC_BS_TK_DAO_17 - [BUG] pending không tính confirmed', async () => await runTest(async (tx) => {
        await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: new Date(), reason: 'C', status: AppointmentStatus.confirmed } });
        const res = await getDoctorDashboardSummary(doctor.id, 'UTC');
        expect(res.pendingAppointments).toBeGreaterThan(0);
    }));

    it('TC_BS_TK_DAO_18 - Biểu đồ đường trả về nhãn VN', async () => {
        const res = await getDoctorAppointmentsByDay(doctor.id, 'UTC');
        expect(res.labels).toContain('Thứ 2');
    });

    it('TC_BS_TK_DAO_19 - Structure check: Summary', async () => {
        const res = await getDoctorDashboardSummary(doctor.id, 'UTC');
        expect(res).toHaveProperty('completedAppointments');
    });

    it('TC_BS_TK_DAO_20 - Structure check: Status', async () => {
        const res = await getDoctorAppointmentStatus(doctor.id, 'UTC');
        expect(res.length).toBeGreaterThanOrEqual(0);
    });
});
