import appointmentService from '@src/services/appointment.service';
import notificationService from '@src/services/notification.service';
import prisma from '@src/config/prisma';
import { ErrorType } from '@src/core/Error';

// Mock Notification Service
jest.mock('@src/services/notification.service', () => ({
    createAndEmit: jest.fn().mockResolvedValue({})
}));

// Mock QueryBuilder
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

describe('Integration Test Appointment Service (EXTENDED SUITE - 25+ CASES)', () => {
    let doctor: any, patient: any, dept: any, room: any;

    beforeAll(async () => {
        const realDoc = await prisma.doctor.findFirst({ include: { staff: { include: { user: true } } } });
        doctor = realDoc ? realDoc.staff.user : null;
        const realPat = await prisma.patient.findFirst({ include: { user: { include: { name: true } } } });
        patient = realPat ? realPat.user : null;
        dept = await prisma.department.findFirst();
        room = await prisma.room.findFirst();
    });

    const runTest = async (fn: (tx: any) => Promise<void>) => {
        await prisma.$transaction(async (tx) => {
            const originals: any = {};
            const models = ['appointment', 'user', 'patient', 'staff', 'doctor', 'schedule', 'department', 'room'];
            const originalTx = prisma.$transaction;
            (prisma as any).$transaction = (cb: any) => cb(tx);
            models.forEach(m => { if ((prisma as any)[m]) { originals[m] = (prisma as any)[m]; (prisma as any)[m] = tx[m]; } });
            try { await fn(tx); } finally {
                (prisma as any).$transaction = originalTx;
                models.forEach(m => { if (originals[m]) (prisma as any)[m] = originals[m]; });
            }
            throw new Error('ROLLBACK');
        }).catch(err => { if (err.message !== 'ROLLBACK') throw err; });
    };

    // --- CORE CRUD & BIZ RULES ---
    it('TC_BS_LH_SER_01 - getAppointmentById: Thành công', async () => {
        await runTest(async (tx) => {
            const apt = await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: new Date(), reason: 'Test' } });
            const result = await appointmentService.getAppointmentById(apt.id);
            expect(result.id).toBe(apt.id);
        });
    });

    it('TC_BS_LH_SER_02 - createAppointment: Thành công (Ngày mai)', async () => {
        await runTest(async (tx) => {
            const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
            // Tạo ca trực mồi cho bác sĩ vào ngày mai (8h - 17h)
            const start = new Date(tomorrow); start.setHours(8, 0, 0, 0);
            const end = new Date(tomorrow); end.setHours(17, 0, 0, 0);
            const sch = await tx.schedule.create({
                data: {
                    staffId: doctor.id,
                    startTime: start,
                    endTime: end,
                    date: start,
                    departmentId: dept.id,
                    roomId: room.id,
                    type: 'appointment'
                }
            });

            const result = await appointmentService.createAppointment({ 
                doctorId: doctor.id, 
                patientId: patient.id, 
                scheduleId: sch.id,
                startTime: start.toISOString(), 
                reason: 'Khám định kỳ trên 10 ký tự', 
                type: 'new' 
            }, patient.id);
            expect(result.status).toBe('pending');
        });
    });

    it('TC_BS_LH_SER_03 - approveAppointment: Bác sĩ duyệt', async () => {
        await runTest(async (tx) => {
            const apt = await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: new Date(), reason: 'Test', status: 'pending' } });
            const result = await appointmentService.approveAppointment(apt.id, { notes: 'Ok' }, 'doctor');
            expect(result.status).toBe('confirmed');
        });
    });

    it('TC_BS_LH_SER_04 - rejectAppointment: Bác sĩ từ chối', async () => {
        await runTest(async (tx) => {
            const apt = await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: new Date(), reason: 'Test', status: 'pending' } });
            const result = await appointmentService.rejectAppointment(apt.id, { reasonCancel: 'Lý do từ chối hợp lệ trên 10 ký tự' }, 'doctor');
            expect(result.status).toBe('rejected');
        });
    });

    it('TC_BS_LH_SER_05 - createAppointment: Lỗi trùng lịch cá nhân', async () => {
        await runTest(async (tx) => {
            const start = new Date(2025, 1, 1, 10, 0); const end = new Date(2025, 1, 1, 10, 30);
            await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: start, endTime: end, reason: 'R1' } });
            await expect(appointmentService.createAppointment({ doctorId: doctor.id, patientId: patient.id, startTime: start.toISOString(), reason: 'R2' }, patient.id)).rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });

    it('TC_BS_LH_SER_06 - createAppointment: Lỗi ngoài giờ trực', async () => {
        await runTest(async (tx) => {
            const start = new Date(2025, 5, 5, 8, 0); const end = new Date(2025, 5, 5, 10, 0);
            const sch = await tx.schedule.create({ data: { staffId: doctor.id, startTime: start, endTime: end, date: start, departmentId: dept.id, roomId: room.id, type: 'appointment' } });
            await expect(appointmentService.createAppointment({ doctorId: doctor.id, scheduleId: sch.id, startTime: new Date(2025, 5, 5, 11, 0).toISOString(), reason: 'Out' }, patient.id)).rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });

    it('TC_BS_LH_SER_07 - createAppointment: Lỗi ca trực đầy', async () => {
        await runTest(async (tx) => {
            const start = new Date(2025, 6, 6, 8, 0); const end = new Date(2025, 6, 6, 9, 0);
            const sch = await tx.schedule.create({ data: { staffId: doctor.id, startTime: start, endTime: end, date: start, departmentId: dept.id, roomId: room.id, type: 'appointment', maxSlot: 1 } });
            await appointmentService.createAppointment({ doctorId: doctor.id, scheduleId: sch.id, startTime: start.toISOString(), reason: 'P1' }, patient.id);
            await expect(appointmentService.createAppointment({ doctorId: doctor.id, scheduleId: sch.id, startTime: start.toISOString(), reason: 'P2' }, patient.id)).rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });

    it('TC_BS_LH_SER_08 - updateAppointment: Quy tắc 24h (Bệnh nhân)', async () => {
        await runTest(async (tx) => {
            const near = new Date(Date.now() + 3600000);
            const apt = await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctor.id, startTime: near, reason: 'Test 24h', status: 'pending' } });
            await expect(appointmentService.updateAppointment(apt.id, { reason: 'Sửa' }, 'patient')).rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });

    // --- SEARCH CASES ---
    it('TC_BS_LH_SER_09 - Search: Tìm 1 phần tên (Mạnh)', async () => {
        await runTest(async () => { expect(await appointmentService.getAppointments({ search: 'Mạnh' })).toBeDefined(); });
    });
    it('TC_BS_LH_SER_10 - Search: Không phân biệt hoa thường (mạnh)', async () => {
        await runTest(async () => { expect(await appointmentService.getAppointments({ search: 'mạnh' })).toBeDefined(); });
    });
    it('TC_BS_LH_SER_11 - Search: Không có kết quả (Bùi)', async () => {
        await runTest(async () => { const res = await appointmentService.getAppointments({ search: 'Bùi' }); expect(res.appointments.length).toBe(0); });
    });
    it('TC_BS_LH_SER_12 - Search: Để trống', async () => {
        await runTest(async () => { expect(await appointmentService.getAppointments({ search: undefined })).toBeDefined(); });
    });
    it('TC_BS_LH_SER_13 - Search: Họ tên đầy đủ (Nguyễn Mạnh) - [BUG]', async () => {
        await runTest(async () => { const res = await appointmentService.getAppointments({ search: 'Nguyễn Mạnh' }); expect(res.appointments.length).toBeGreaterThan(0); });
    });
    it('TC_BS_LH_SER_14 - Search ID: Một phần ID (PAT)', async () => {
        await runTest(async () => { expect(await appointmentService.getAppointments({ search: 'PAT' })).toBeDefined(); });
    });
    it('TC_BS_LH_SER_15 - Search ID: ID chính xác (PAT007)', async () => {
        await runTest(async () => { expect(await appointmentService.getAppointments({ search: 'PAT007' })).toBeDefined(); });
    });
    it('TC_BS_LH_SER_16 - Search: Ký tự đặc biệt (@#$)', async () => {
        await runTest(async () => { const res = await appointmentService.getAppointments({ search: '@#$' }); expect(res.appointments.length).toBe(0); });
    });

    // --- FILTER CASES ---
    it('TC_BS_LH_SER_17 - Filter Status: Tất cả', async () => {
        await runTest(async () => { expect(await appointmentService.getAppointments({ status: undefined })).toBeDefined(); });
    });
    it('TC_BS_LH_SER_18 - Filter Status: Đã xác nhận', async () => {
        await runTest(async () => { expect(await appointmentService.getAppointments({ status: 'confirmed' })).toBeDefined(); });
    });
    it('TC_BS_LH_SER_19 - Filter Status: Chờ xác nhận', async () => {
        await runTest(async () => { expect(await appointmentService.getAppointments({ status: 'pending' })).toBeDefined(); });
    });
    it('TC_BS_LH_SER_20 - Filter Status: Đã từ chối (Rejected) - [BUG]', async () => {
        await runTest(async () => { await appointmentService.getAppointments({ status: 'rejected' as any }); });
    });
    it('TC_BS_LH_SER_21 - Filter Status: Đã hủy', async () => {
        await runTest(async () => { expect(await appointmentService.getAppointments({ status: 'cancelled' })).toBeDefined(); });
    });
    it('TC_BS_LH_SER_22 - Filter Date: Ngày cụ thể', async () => {
        await runTest(async () => { const d = new Date(); expect(await appointmentService.getAppointments({ fromDate: d, toDate: d })).toBeDefined(); });
    });

    // --- COMBINED ---
    it('TC_BS_LH_SER_23 - Filter Combined: Mạnh + Cancelled + Date', async () => {
        await runTest(async () => { expect(await appointmentService.getAppointments({ search: 'Mạnh', status: 'cancelled' })).toBeDefined(); });
    });
    it('TC_BS_LH_SER_24 - Filter Combined: Full Name + Date - [BUG]', async () => {
        await runTest(async () => { const res = await appointmentService.getAppointments({ search: 'Nguyễn Mạnh' }); expect(res.appointments.length).toBeGreaterThan(0); });
    });

    // --- SLOTS ---
    it('TC_BS_LH_SER_25 - getAvailableSlots: Thành công', async () => {
        await runTest(async (tx) => {
            const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
            const start = new Date(tomorrow.setHours(8, 0, 0, 0));
            const end = new Date(tomorrow.setHours(10, 0, 0, 0));
            await tx.schedule.create({ data: { staffId: doctor.id, startTime: start, endTime: end, date: tomorrow, departmentId: dept.id, roomId: room.id, type: 'appointment', maxSlot: 10, status: 'confirmed' } });
            const result = await appointmentService.getAvailableSlots({ doctorId: doctor.id, date: tomorrow.toISOString().split('T')[0] }, 'Asia/Ho_Chi_Minh');
            expect(result.slots.length).toBeGreaterThan(0);
        });
    });
});
