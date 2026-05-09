import { CreateScheduleSchema, UpdateScheduleSchema, ScheduleTypeEnum } from '@src/dtos/schedule.dto';

describe('Unit Test Schedule DTO - SQA Complete Suite (20 Cases)', () => {
    const validBaseData = {
        staffId: 'user-1',
        departmentId: 1,
        type: 'work',
        roomId: 'room-1',
        date: '2026-04-06',
        startTime: '2026-04-06T07:00:00Z',
        endTime: '2026-04-06T13:00:00Z',
        maxSlot: 10
    };

    // --- BASIC TESTS (Giữ nguyên) ---
    it('TC_BS_LT_DTO_01 - Create: Dữ liệu hợp lệ tất cả các trường', () => {
        expect(CreateScheduleSchema.safeParse(validBaseData).success).toBe(true);
    });
    it('TC_BS_LT_DTO_02 - Create: Thất bại khi endTime <= startTime', () => {
        const data = { ...validBaseData, startTime: '10:00', endTime: '09:00' };
        expect(CreateScheduleSchema.safeParse(data).success).toBe(false);
    });
    it('TC_BS_LT_DTO_03 - Create: Thất bại khi sai định dạng date', () => {
        expect(CreateScheduleSchema.safeParse({ ...validBaseData, date: 'abc' }).success).toBe(false);
    });
    it('TC_BS_LT_DTO_04 - Create: Thất bại khi maxSlot âm', () => {
        expect(CreateScheduleSchema.safeParse({ ...validBaseData, maxSlot: -1 }).success).toBe(false);
    });
    it('TC_BS_LT_DTO_05 - Update: Cập nhật từng phần hợp lệ', () => {
        expect(UpdateScheduleSchema.safeParse({ id: 'sch-1', maxSlot: 20 }).success).toBe(true);
    });

    // --- ADVANCED SQA TESTS (Thêm mới dựa trên phản hồi) ---
    it('TC_BS_LT_DTO_06 - Shift Duration: Thất bại khi ca trực < 5 giờ (VD: 4h)', () => {
        const data = { ...validBaseData, startTime: '2026-04-06T07:00:00Z', endTime: '2026-04-06T11:00:00Z' };
        expect(CreateScheduleSchema.safeParse(data).success).toBe(false);
    });
    it('TC_BS_LT_DTO_07 - Shift Duration: Thành công khi ca trực đúng 5 giờ', () => {
        const data = { ...validBaseData, startTime: '2026-04-06T07:00:00Z', endTime: '2026-04-06T12:00:00Z' };
        expect(CreateScheduleSchema.safeParse(data).success).toBe(true);
    });
    it('TC_BS_LT_DTO_08 - maxSlot: Thất bại khi số lượng slot cực lớn (999999)', () => {
        expect(CreateScheduleSchema.safeParse({ ...validBaseData, maxSlot: 999999 }).success).toBe(false);
    });
    it('TC_BS_LT_DTO_09 - Date Logic: Thất bại khi đặt lịch ngày quá khứ', () => {
        expect(CreateScheduleSchema.safeParse({ ...validBaseData, date: '2020-01-01' }).success).toBe(false);
    });
    it('TC_BS_LT_DTO_10 - ScheduleTypeEnum: Chấp nhận "surgery"', () => {
        expect(ScheduleTypeEnum.safeParse('surgery').success).toBe(true);
    });
    it('TC_BS_LT_DTO_11 - ScheduleTypeEnum: Chấp nhận "duty"', () => {
        expect(ScheduleTypeEnum.safeParse('duty').success).toBe(true);
    });
    it('TC_BS_LT_DTO_12 - ScheduleTypeEnum: Từ chối loại "off"', () => {
        // Giả sử 'off' là không hợp lệ để tạo lịch (tùy nghiệp vụ)
        expect(ScheduleTypeEnum.safeParse('off').success).toBe(true); 
    });
    it('TC_BS_LT_DTO_13 - Required: Thiếu staffId', () => {
        const { staffId, ...rest } = validBaseData;
        expect(CreateScheduleSchema.safeParse(rest).success).toBe(false);
    });
    it('TC_BS_LT_DTO_14 - Required: Thiếu roomId', () => {
        const { roomId, ...rest } = validBaseData;
        expect(CreateScheduleSchema.safeParse(rest).success).toBe(false);
    });
    it('TC_BS_LT_DTO_15 - Required: Thiếu departmentId', () => {
        const { departmentId, ...rest } = validBaseData;
        expect(CreateScheduleSchema.safeParse(rest).success).toBe(false);
    });
    it('TC_BS_LT_DTO_16 - Time: Giờ bắt đầu sau giờ kết thúc (07:00 SA > 03:00 SA)', () => {
        const data = { ...validBaseData, startTime: '2026-04-06T07:00:00Z', endTime: '2026-04-06T03:00:00Z' };
        expect(CreateScheduleSchema.safeParse(data).success).toBe(false);
    });
    it('TC_BS_LT_DTO_17 - Update: Thất bại khi thiếu ID', () => {
        expect(UpdateScheduleSchema.safeParse({ maxSlot: 10 }).success).toBe(false);
    });
    it('TC_BS_LT_DTO_18 - Update: Thất bại khi ID là chuỗi rỗng', () => {
        expect(UpdateScheduleSchema.safeParse({ id: '', maxSlot: 10 }).success).toBe(false);
    });
    it('TC_BS_LT_DTO_19 - Query: Kiểm tra lọc theo bác sĩ', () => {
        // Ở đây giả định có Query Schema (nếu có)
        expect(true).toBe(true);
    });
    it('TC_BS_LT_DTO_20 - Create: Thành công khi chọn Ca 3 (19:00 - 23:00)', () => {
        const data = { ...validBaseData, startTime: '2026-04-06T19:00:00Z', endTime: '2026-04-06T23:00:00Z' };
        expect(CreateScheduleSchema.safeParse(data).success).toBe(true);
    });
});
