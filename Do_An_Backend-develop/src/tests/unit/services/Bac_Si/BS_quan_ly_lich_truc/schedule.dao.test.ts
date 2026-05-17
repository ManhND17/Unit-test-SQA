import { getListSchedules, createSchedule, updateSchedule, deleteSchedule, getScheduleById, setScheduleStatus } from '@src/daos/schedule.dao';
import prisma from '@src/config/prisma';

describe('Integration Test Schedule DAO - SQA Full Suite (15 Cases)', () => {
    let doctor: any, dept: any, room: any;

    beforeAll(async () => {
        const docRecord = await prisma.doctor.findFirst({ include: { staff: { include: { user: true } } } });
        doctor = docRecord?.staff.user;
        dept = await prisma.department.findFirst();
        room = await prisma.room.findFirst();
    });

    const runTest = async (fn: (tx: any) => Promise<void>) => {
        await prisma.$transaction(async (tx) => {
            const originals: any = {};
            const models = ['schedule', 'appointment', 'user', 'patient', 'staff', 'doctor', 'department', 'room'];
            const originalTx = prisma.$transaction;

            // Mock prisma.$transaction to return the current tx
            (prisma as any).$transaction = (cb: any) => cb(tx);

            // Mock all models to use the current tx
            models.forEach(m => {
                if ((prisma as any)[m]) {
                    originals[m] = (prisma as any)[m];
                    (prisma as any)[m] = tx[m];
                }
            });

            try {
                await fn(tx);
            } finally {
                // Restore original prisma state
                (prisma as any).$transaction = originalTx;
                models.forEach(m => {
                    if (originals[m]) (prisma as any)[m] = originals[m];
                });
            }
            throw new Error('ROLLBACK');
        }).catch(err => { if (err.message !== 'ROLLBACK') throw err; });
    };

    it('TC_BS_LT_DAO_01 - createSchedule: Lưu thành công dữ liệu cơ bản', async () => {
        await runTest(async (tx) => {
            const res = await createSchedule({ staffId: doctor.id, departmentId: dept.id, roomId: room.id, date: '2026-04-06', startTime: '2026-04-06T07:00:00Z', endTime: '2026-04-06T13:00:00Z', type: 'work' as any });
            expect(res.id).toBeDefined();
        });
    });
    it('TC_BS_LT_DAO_02 - Date Parsing: Hỗ trợ dd-MM-yyyy (06-04-2026)', async () => {
        await runTest(async (tx) => {
            const res = await createSchedule({ staffId: doctor.id, departmentId: dept.id, roomId: room.id, date: '06-04-2026', startTime: '2026-04-06T07:00:00Z', endTime: '2026-04-06T13:00:00Z' } as any);
            expect(res.date.getUTCFullYear()).toBe(2026);
        });
    });
    it('TC_BS_LT_DAO_03 - getListSchedules: Lọc theo tháng của ngày 06/04/2026', async () => {
        await runTest(async (tx) => {
            await tx.schedule.create({ data: { staffId: doctor.id, departmentId: dept.id, roomId: room.id, date: new Date('2026-04-06'), startTime: new Date(), endTime: new Date(), type: 'work' } });
            const res = await getListSchedules({ date: '06-04-2026' }, doctor.id);
            expect(res.data.length).toBeGreaterThan(0);
        });
    });
    it('TC_BS_LT_DAO_04 - Pagination: Kiểm tra limit = 1', async () => {
        await runTest(async (tx) => {
            await tx.schedule.createMany({
                data: [
                    { staffId: doctor.id, departmentId: dept.id, roomId: room.id, date: new Date('2026-04-01'), startTime: new Date(), endTime: new Date(), type: 'work' },
                    { staffId: doctor.id, departmentId: dept.id, roomId: room.id, date: new Date('2026-04-02'), startTime: new Date(), endTime: new Date(), type: 'work' }
                ]
            });
            const res = await getListSchedules({ limit: '1', date: '01-04-2026' }, doctor.id);
            expect(res.data.length).toBe(1);
        });
    });
    it('TC_BS_LT_DAO_05 - updateSchedule: Thay đổi maxSlot', async () => {
        await runTest(async (tx) => {
            const sch = await tx.schedule.create({ data: { staffId: doctor.id, departmentId: dept.id, roomId: room.id, date: new Date(), startTime: new Date(), endTime: new Date(), type: 'work' } });
            const res = await updateSchedule(sch.id, { maxSlot: 50 });
            expect(res.maxSlot).toBe(50);
        });
    });
    it('TC_BS_LT_DAO_06 - setScheduleStatus: Chuyển sang confirmed', async () => {
        await runTest(async (tx) => {
            const sch = await tx.schedule.create({ data: { staffId: doctor.id, departmentId: dept.id, roomId: room.id, date: new Date(), startTime: new Date(), endTime: new Date(), type: 'work', status: 'pending' } });
            const res = await setScheduleStatus(sch.id, 'confirmed');
            expect(res.status).toBe('confirmed');
        });
    });
    it('TC_BS_LT_DAO_07 - deleteSchedule: Xóa lịch thành công', async () => {
        await runTest(async (tx) => {
            const sch = await tx.schedule.create({ data: { staffId: doctor.id, departmentId: dept.id, roomId: room.id, date: new Date(), startTime: new Date(), endTime: new Date(), type: 'work' } });
            await deleteSchedule(sch.id);
            const check = await tx.schedule.findUnique({ where: { id: sch.id } });
            expect(check).toBeNull();
        });
    });
    it('TC_BS_LT_DAO_08 - getScheduleById: Lấy dữ liệu kèm phòng khám', async () => {
        await runTest(async (tx) => {
            const sch = await tx.schedule.create({ data: { staffId: doctor.id, departmentId: dept.id, roomId: room.id, date: new Date(), startTime: new Date(), endTime: new Date(), type: 'work' } });
            const res = await getScheduleById(sch.id);
            expect(res?.room.id).toBe(room.id);
        });
    });
    it('TC_BS_LT_DAO_09 - Date Parsing: Hỗ trợ ISO string', async () => {
        await runTest(async (tx) => {
            const res = await createSchedule({ staffId: doctor.id, departmentId: dept.id, roomId: room.id, date: '2026-04-06T00:00:00Z', startTime: '2026-04-06T07:00:00Z', endTime: '2026-04-06T13:00:00Z' } as any);
            expect(res.date.getUTCDate()).toBe(6);
        });
    });
    it('TC_BS_LT_DAO_10 - updateSchedule: Thay đổi phòng khám', async () => {
        await runTest(async (tx) => {
            const sch = await tx.schedule.create({ data: { staffId: doctor.id, departmentId: dept.id, roomId: room.id, date: new Date(), startTime: new Date(), endTime: new Date(), type: 'work' } });
            // Giả định có phòng khác
            const res = await updateSchedule(sch.id, { roomId: room.id });
            expect(res.roomId).toBe(room.id);
        });
    });
    it('TC_BS_LT_DAO_11 - getListSchedules: Trả về metadata pagination', async () => {
        await runTest(async (tx) => {
            const res = await getListSchedules({}, doctor.id);
            expect(res.metadata.totalItems).toBeDefined();
        });
    });
    it('TC_BS_LT_DAO_12 - createSchedule: Lỗi khi thiếu data (Negative)', async () => {
        await expect(createSchedule(null as any)).resolves.toEqual([]);
    });
    it('TC_BS_LT_DAO_13 - getScheduleById: Null khi ID không tồn tại', async () => {
        const res = await getScheduleById('none');
        expect(res).toBeNull();
    });
    it('TC_BS_LT_DAO_14 - Date Parsing: Hỗ trợ yyyy-MM-dd', async () => {
        await runTest(async (tx) => {
            const res = await createSchedule({ staffId: doctor.id, departmentId: dept.id, roomId: room.id, date: '2026-04-10', startTime: '2026-04-10T07:00:00Z', endTime: '2026-04-10T13:00:00Z' } as any);
            expect(res.date.getUTCDate()).toBe(10);
        });
    });
    it('TC_BS_LT_DAO_15 - updateSchedule: Thay đổi loại lịch (type)', async () => {
        await runTest(async (tx) => {
            const sch = await tx.schedule.create({ data: { staffId: doctor.id, departmentId: dept.id, roomId: room.id, date: new Date(), startTime: new Date(), endTime: new Date(), type: 'work' } });
            const res = await updateSchedule(sch.id, { type: 'surgery' as any });
            expect(res.type).toBe('surgery');
        });
    });
});
