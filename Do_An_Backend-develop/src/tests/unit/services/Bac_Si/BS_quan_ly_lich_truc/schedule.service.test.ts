import scheduleService from '@src/services/schedule.service';
import prisma from '@src/config/prisma';
import { ErrorType } from '@src/core/Error';

describe('Integration Test Schedule Service - SQA Final Suite (20 Cases)', () => {
    let doctorA: any, doctorB: any, dept: any, room: any, patient: any;

    beforeAll(async () => {
        const doctors = await prisma.doctor.findMany({ take: 2, include: { staff: { include: { user: true } } } });
        doctorA = doctors[0].staff.user;
        doctorB = doctors[1].staff.user;
        dept = await prisma.department.findFirst();
        room = await prisma.room.findFirst();
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

    // --- BASIC & SUCCESS ---
    it('TC_BS_LT_SER_01 - Create: Thành công dữ liệu hợp lệ', async () => {
        await runTest(async (tx) => {
            const data = { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: '2026-04-06', startTime: '2026-04-06T07:00:00Z', endTime: '2026-04-06T13:00:00Z', type: 'work' as any };
            const res = await scheduleService.createScheduleService(data);
            expect(res.id).toBeDefined();
        });
    });
    it('TC_BS_LT_SER_02 - updateScheduleService: Thành công (Happy Path)', async () => {
        await runTest(async (tx) => {
            const sch = await tx.schedule.create({ data: { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: new Date(), startTime: new Date(), endTime: new Date(), type: 'work' } });
            const res = await scheduleService.updateScheduleService({ id: sch.id, maxSlot: 20 }, doctorA.id);
            expect(res.maxSlot).toBe(20);
        });
    });
    it('TC_BS_LT_SER_03 - deleteScheduleService: Thành công (Happy Path)', async () => {
        await runTest(async (tx) => {
            const sch = await tx.schedule.create({ data: { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: new Date(), startTime: new Date(), endTime: new Date(), type: 'work' } });
            await scheduleService.deleteScheduleService(sch.id, doctorA.id);
            const check = await tx.schedule.findUnique({ where: { id: sch.id } });
            expect(check).toBeNull();
        });
    });

    // --- BUGS & BUSINESS RULES DETECTORS ---
    it('TC_BS_LT_SER_04 - [BUG] Overlap: Không cho phép tạo ca trùng 1 phần thời gian', async () => {
        await runTest(async (tx) => {
            // Tạo ca làm việc 1: 07:00 - 13:00
            await tx.schedule.create({ 
                data: { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: new Date('2026-04-06'), startTime: new Date('2026-04-06T07:00:00Z'), endTime: new Date('2026-04-06T13:00:00Z'), type: 'work' } 
            });
            // Tạo ca làm việc 2 trùng lặp: 09:00 - 19:00
            const overlap = { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: '2026-04-06', startTime: '2026-04-06T09:00:00Z', endTime: '2026-04-06T19:00:00Z', type: 'work' as any };
            
            // Nếu tạo thành công (không throw lỗi) thì test này sẽ FAIL vì mong đợi phải Reject
            await expect(scheduleService.createScheduleService(overlap)).rejects.toThrow();
        });
    });

    it('TC_BS_LT_SER_05 - [BUG] Slot: Không cho phép giảm slot thấp hơn số bệnh nhân đã đặt', async () => {
        await runTest(async (tx) => {
            // Tạo ca làm việc ban đầu có 5 slot
            const sch = await tx.schedule.create({ 
                data: { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: new Date(), startTime: new Date(), endTime: new Date(), type: 'work', maxSlot: 5 } 
            });
            // Giả lập có 5 người đã đăng ký khám
            const appointments = Array.from({ length: 5 }).map((_, i) => ({
                patientId: patient.id, doctorId: doctorA.id, scheduleId: sch.id, startTime: new Date(), reason: `Test ${i}`, status: 'confirmed'
            }));
            await tx.appointment.createMany({ data: appointments });

            // Thử update slot xuống 3 (nhỏ hơn 5). Nếu thành công thì test này sẽ FAIL.
            await expect(scheduleService.updateScheduleService({ id: sch.id, maxSlot: 3 }, doctorA.id)).rejects.toThrow();
        });
    });

    // --- BUGS & BUSINESS RULES ---
    it('TC_BS_LT_SER_06 - [BUG] Overlap: Không cho phép tạo ca trùng 1 phần thời gian', async () => {
        await runTest(async (tx) => {
            await tx.schedule.create({ data: { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: new Date('2026-04-06'), startTime: new Date('2026-04-06T07:00:00Z'), endTime: new Date('2026-04-06T13:00:00Z'), type: 'work' } });
            const overlap = { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: '2026-04-06', startTime: '2026-04-06T09:00:00Z', endTime: '2026-04-06T19:00:00Z', type: 'work' as any };
            await expect(scheduleService.createScheduleService(overlap)).rejects.toThrow();
        });
    });
    it('TC_BS_LT_SER_07 - [BUG] Slot: Không cho phép giảm slot thấp hơn số bệnh nhân đã đặt', async () => {
        await runTest(async (tx) => {
            const sch = await tx.schedule.create({ data: { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: new Date(), startTime: new Date(), endTime: new Date(), type: 'work', maxSlot: 10 } });
            await tx.appointment.createMany({ data: [{ patientId: patient.id, doctorId: doctorA.id, scheduleId: sch.id, startTime: new Date(), reason: 'T1', status: 'confirmed' }, { patientId: patient.id, doctorId: doctorA.id, scheduleId: sch.id, startTime: new Date(), reason: 'T2', status: 'confirmed' }] });
            await expect(scheduleService.updateScheduleService({ id: sch.id, maxSlot: 1 }, doctorA.id)).rejects.toThrow();
        });
    });
    it('TC_BS_LT_SER_08 - [BUG] Shift: Ca 1 không được phép bắt đầu sớm (05:00)', async () => {
        await runTest(async (tx) => {
            const data = { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: '2026-04-06', startTime: '2026-04-06T05:00:00Z', endTime: '2026-04-06T13:00:00Z', type: 'work' as any };
            await expect(scheduleService.createScheduleService(data)).rejects.toThrow();
        });
    });
    it('TC_BS_LT_SER_09 - [BUG] Time: Sửa giờ làm bệnh nhân mất lịch', async () => {
        await runTest(async (tx) => {
            const sch = await tx.schedule.create({ data: { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: new Date('2026-04-06'), startTime: new Date('2026-04-06T07:00:00Z'), endTime: new Date('2026-04-06T13:00:00Z'), type: 'work' } });
            await tx.appointment.create({ data: { patientId: patient.id, doctorId: doctorA.id, scheduleId: sch.id, startTime: new Date('2026-04-06T07:30:00Z'), reason: 'K', status: 'confirmed' } });
            await expect(scheduleService.updateScheduleService({ id: sch.id, startTime: '2026-04-06T08:00:00Z' }, doctorA.id)).rejects.toThrow();
        });
    });
    it('TC_BS_LT_SER_10 - [BUG] Shift 3: Tạo ca 3 hợp lệ (19:00 - 23:00) thành công', async () => {
        await runTest(async (tx) => {
            const data = { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: '2026-04-06', startTime: '2026-04-06T19:00:00Z', endTime: '2026-04-06T23:00:00Z', type: 'duty' as any };
            const res = await scheduleService.createScheduleService(data);
            expect(res.id).toBeDefined();
        });
    });

    // --- ADMIN & OTHERS ---
    it('TC_BS_LT_SER_11 - getSchedulesAdmin: Lấy danh sách cho Admin thành công', async () => {
        await runTest(async (tx) => {
            const res = await scheduleService.getSchedulesAdmin({});
            expect(res.data).toBeDefined();
        });
    });
    it('TC_BS_LT_SER_12 - approveScheduleAdmin: Admin duyệt lịch thành công', async () => {
        await runTest(async (tx) => {
            const sch = await tx.schedule.create({ data: { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: new Date(), startTime: new Date(), endTime: new Date(), type: 'work', status: 'pending' } });
            const res = await scheduleService.approveScheduleAdmin(sch.id, 'confirmed');
            expect(res.status).toBe('confirmed');
        });
    });
    it('TC_BS_LT_SER_13 - getScheduleByIdService: Lấy chi tiết lịch thành công', async () => {
        await runTest(async (tx) => {
            const sch = await tx.schedule.create({ data: { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: new Date(), startTime: new Date(), endTime: new Date(), type: 'work' } });
            const res = await scheduleService.getScheduleByIdService(sch.id);
            expect(res.id).toBe(sch.id);
        });
    });
    it('TC_BS_LT_SER_14 - Error: Thất bại khi nhân viên không tồn tại', async () => {
        const data = { staffId: 'none', departmentId: dept.id, roomId: room.id, date: '2026-04-06', startTime: '...', endTime: '...', type: 'work' as any };
        await expect(scheduleService.createScheduleService(data)).rejects.toMatchObject({ type: ErrorType.NOT_FOUND });
    });
    it('TC_BS_LT_SER_15 - Multi-Shift: Tạo 2 ca không trùng nhau trong cùng ngày thành công', async () => {
        await runTest(async (tx) => {
            await scheduleService.createScheduleService({ staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: '2026-04-06', startTime: '2026-04-06T07:00:00Z', endTime: '2026-04-06T10:00:00Z', type: 'work' as any });
            const res = await scheduleService.createScheduleService({ staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: '2026-04-06', startTime: '2026-04-06T14:00:00Z', endTime: '2026-04-06T17:00:00Z', type: 'work' as any });
            expect(res.id).toBeDefined();
        });
    });
    it('TC_BS_LT_SER_16 - completePastSchedules: Không cập nhật nếu lịch ở tương lai', async () => {
        await runTest(async (tx) => {
            const future = new Date(Date.now() + 86400000);
            await tx.schedule.create({ data: { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: future, startTime: future, endTime: future, status: 'confirmed', type: 'work' } });
            const res = await scheduleService.completePastSchedules();
            // Lịch tương lai không bị xử lý
            expect(res.updated).toBe(0);
        });
    });
    it('TC_BS_LT_SER_17 - Boundary: Tạo lịch vào năm sau (2027) thành công', async () => {
        await runTest(async (tx) => {
            const data = { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: '2027-01-01', startTime: '2027-01-01T08:00:00Z', endTime: '2027-01-01T13:00:00Z', type: 'work' as any };
            const res = await scheduleService.createScheduleService(data);
            expect(res.id).toBeDefined();
        });
    });
    it('TC_BS_LT_SER_18 - Error: Lấy lịch theo ID không tồn tại báo lỗi 404', async () => {
        await expect(scheduleService.getScheduleByIdService('wrong-id')).rejects.toMatchObject({ type: ErrorType.NOT_FOUND });
    });
    it('TC_BS_LT_SER_19 - getSchedules: Trả về danh sách rỗng khi bác sĩ chưa có lịch', async () => {
        await runTest(async (tx) => {
            const res = await scheduleService.getSchedules({ date: '01-01-2099' }, doctorA.id);
            expect(res.data.length).toBe(0);
        });
    });
    it('TC_BS_LT_SER_20 - completePastSchedules: Trả về kết quả processed > 0', async () => {
        await runTest(async (tx) => {
            const past = new Date(Date.now() - 3600000);
            await tx.schedule.create({ data: { staffId: doctorA.id, departmentId: dept.id, roomId: room.id, date: past, startTime: past, endTime: past, status: 'confirmed', type: 'work' } });
            const res = await scheduleService.completePastSchedules();
            expect(res.processed).toBeGreaterThan(0);
        });
    });
});
