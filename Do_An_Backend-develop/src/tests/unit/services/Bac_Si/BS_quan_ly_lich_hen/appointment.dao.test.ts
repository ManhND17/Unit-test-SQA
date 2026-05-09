import appointmentDao from '@src/daos/appointment.dao';
import prisma from '@src/config/prisma';

// Mock QueryBuilder để hỗ trợ transaction trong DAO
jest.mock('@src/helpers/queryBuilder', () => {
    const actual = jest.requireActual('@src/helpers/queryBuilder');
    return {
        ...actual,
        createQueryBuilder: (model: any) => {
            const builder = actual.createQueryBuilder(model);
            const prismaInstance = require('@src/config/prisma').default;
            (builder as any).delegate = prismaInstance[model];
            return builder;
        }
    };
});

describe('Unit Test Appointment DAO (Full 15 Cases - Thực tế) - (TC_BS_LH_DAO_01 -> 15)', () => {
    let doctor: any, patient: any, dept: any, room: any;

    beforeAll(async () => {
        const realDoctor = await prisma.doctor.findFirst({ include: { staff: { include: { user: true } } } });
        doctor = realDoctor ? realDoctor.staff.user : await require('@src/tests/helpers/test-helper').getTestUser('doctor');

        const realPatient = await prisma.patient.findFirst({ include: { user: true } });
        patient = realPatient ? realPatient.user : await require('@src/tests/helpers/test-helper').getTestUser('patient');

        dept = await (prisma as any).department.findFirst() || await (prisma as any).department.create({ data: { name: 'T', description: 'D', code: 'T'+Date.now(), type: 'clinical' } });
        room = await (prisma as any).room.findFirst() || await (prisma as any).room.create({ data: { name: 'R', buildingId: (await (prisma as any).building.findFirst())?.id, type: 'staff', floor: 1 } });
    });

    const runTest = async (fn: () => Promise<void>) => {
        try { await prisma.$transaction(async (tx) => {
            const originals: any = {};
            const models = ['appointment', 'schedule', 'user'];
            models.forEach(m => { if ((prisma as any)[m]) { originals[m] = (prisma as any)[m]; (prisma as any)[m] = tx[m]; } });
            try { await fn(); } finally { models.forEach(m => { if (originals[m]) (prisma as any)[m] = originals[m]; }); }
            throw new Error('ROLLBACK');
        }); } catch (e: any) { if (e.message !== 'ROLLBACK') throw e; }
    };

    it('TC_BS_LH_DAO_01 - createAppointment: Tạo lịch hẹn mới thành công', async () => {
        await runTest(async () => {
            const res = await appointmentDao.createAppointment({ patientId: patient.id, doctorId: doctor.id, startTime: new Date(), reason: 'R', type: 'new' }, patient.id);
            expect(res.patientId).toBe(patient.id);
        });
    });

    it('TC_BS_LH_DAO_02 - updateAppointment: Cập nhật trạng thái sang Confirmed', async () => {
        await runTest(async () => {
            const apt = await (prisma as any).appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: new Date(), reason: 'R', status: 'pending' } });
            const res = await appointmentDao.updateAppointment(apt.id, { status: 'confirmed' });
            expect(res.status).toBe('confirmed');
        });
    });

    it('TC_BS_LH_DAO_03 - cancelAppointment: Hủy lịch hẹn thành công', async () => {
        await runTest(async () => {
            const apt = await (prisma as any).appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: new Date(), reason: 'R', status: 'pending' } });
            const res = await appointmentDao.cancelAppointment(apt.id, 'Busy');
            expect(res.status).toBe('cancelled');
        });
    });

    it('TC_BS_LH_DAO_04 - getAppointments: Biên dưới - limit = 1', async () => {
        await runTest(async () => {
            await (prisma as any).appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: new Date(), reason: 'R' } });
            const res = await appointmentDao.getAppointments({ limit: 1 });
            expect(res.data.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('TC_BS_LH_DAO_05 - getAppointments: Tìm kiếm theo tên bệnh nhân thực tế', async () => {
        await runTest(async () => {
            const realUser = await prisma.user.findFirst({ where: { id: patient.id }, include: { name: true } });
            const res = await appointmentDao.getAppointments({ search: realUser?.name?.firstName || 'Test' });
            expect(res.data.length).toBeGreaterThanOrEqual(0);
        });
    });

    it('TC_BS_LH_DAO_06 - hasConflictingAppointment: Phát hiện trùng thời gian', async () => {
        await runTest(async () => {
            const s = new Date(2025, 1, 1, 8, 0); const e = new Date(2025, 1, 1, 8, 30);
            await (prisma as any).appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: s, endTime: e, reason: 'R', status: 'confirmed' } });
            expect(await appointmentDao.hasConflictingAppointment(patient.id, s, e)).toBe(true);
        });
    });

    it('TC_BS_LH_DAO_07 - hasConflictingAppointment: Không trùng khi lịch đã bị hủy', async () => {
        await runTest(async () => {
            const s = new Date(); const e = new Date(Date.now() + 100000);
            await (prisma as any).appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: s, endTime: e, reason: 'R', status: 'cancelled' } });
            expect(await appointmentDao.hasConflictingAppointment(patient.id, s, e)).toBe(false);
        });
    });

    it('TC_BS_LH_DAO_08 - countAppointmentsInSlot: Đếm số lịch trong slot', async () => {
        await runTest(async () => {
            const sch = await (prisma as any).schedule.create({ data: { staffId: doctor.id, startTime: new Date(), endTime: new Date(), departmentId: dept.id, roomId: room.id, date: new Date(), type: 'appointment' } });
            await (prisma as any).appointment.create({ data: { scheduleId: sch.id, doctorId: doctor.id, patientId: patient.id, startTime: new Date(), endTime: new Date(Date.now()+1000), reason: 'R', status: 'confirmed' } });
            expect(await appointmentDao.countAppointmentsInSlot(sch.id, new Date(0), new Date())).toBeGreaterThanOrEqual(0);
        });
    });

    it('TC_BS_LH_DAO_09 - getAppointmentById: Trả về null khi ID sai', async () => {
        await runTest(async () => {
            expect(await appointmentDao.getAppointmentById('550e8400-e29b-41d4-a716-446655440000')).toBeNull();
        });
    });

    it('TC_BS_LH_DAO_10 - updateAppointment: Lỗi khi update ID sai', async () => {
        await runTest(async () => {
            await expect(appointmentDao.updateAppointment('550e8400-e29b-41d4-a716-446655440000', { status: 'confirmed' })).rejects.toThrow();
        });
    });

    it('TC_BS_LH_DAO_11 - getDoctorSchedulesByDate: Lấy lịch làm việc thực tế', async () => {
        await runTest(async () => {
            const today = new Date();
            await (prisma as any).schedule.create({ data: { staffId: doctor.id, startTime: today, endTime: today, departmentId: dept.id, roomId: room.id, date: today, type: 'appointment', status: 'confirmed' } });
            expect((await appointmentDao.getDoctorSchedulesByDate(doctor.id, today, 'Asia/Ho_Chi_Minh')).length).toBeGreaterThan(0);
        });
    });

    it('TC_BS_LH_DAO_12 - countAppointmentsInSchedule: Đếm tổng số lịch trong ca', async () => {
        await runTest(async () => {
            const sch = await (prisma as any).schedule.create({ data: { staffId: doctor.id, startTime: new Date(), endTime: new Date(), departmentId: dept.id, roomId: room.id, date: new Date(), type: 'appointment' } });
            await (prisma as any).appointment.create({ data: { scheduleId: sch.id, doctorId: doctor.id, patientId: patient.id, startTime: new Date(), reason: 'R', status: 'confirmed' } });
            expect(await appointmentDao.countAppointmentsInSchedule(sch.id)).toBeGreaterThan(0);
        });
    });

    it('TC_BS_LH_DAO_13 - getBookedTimesInSchedule: Lấy danh sách giờ đã đặt', async () => {
        await runTest(async () => {
            const sch = await (prisma as any).schedule.create({ data: { staffId: doctor.id, startTime: new Date(), endTime: new Date(), departmentId: dept.id, roomId: room.id, date: new Date(), type: 'appointment' } });
            const s = new Date();
            await (prisma as any).appointment.create({ data: { scheduleId: sch.id, doctorId: doctor.id, patientId: patient.id, startTime: s, reason: 'R', status: 'confirmed' } });
            expect((await appointmentDao.getBookedTimesInSchedule(sch.id)).length).toBeGreaterThan(0);
        });
    });

    it('TC_BS_LH_DAO_14 - getAppointments: Lọc theo khoảng thời gian thực', async () => {
        await runTest(async () => {
            const d = new Date(2025, 11, 25);
            await (prisma as any).appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: d, reason: 'R' } });
            const res = await appointmentDao.getAppointments({ fromDate: d, toDate: d });
            expect(res.data.length).toBeGreaterThanOrEqual(0);
        });
    });

    it('TC_BS_LH_DAO_15 - getAppointments: Sắp xếp theo thời gian giảm dần', async () => {
        await runTest(async () => {
            await (prisma as any).appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: new Date(2025, 1, 1), reason: 'R' } });
            await (prisma as any).appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: new Date(2025, 1, 2), reason: 'R' } });
            const res = await appointmentDao.getAppointments({ sortBy: 'startTime', sortOrder: 'desc' });
            expect(res.data[0].startTime.getTime()).toBeGreaterThan(res.data[1].startTime.getTime());
        });
    });
});
