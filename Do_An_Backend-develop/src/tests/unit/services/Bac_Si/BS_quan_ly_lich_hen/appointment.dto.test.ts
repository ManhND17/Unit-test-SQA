import { GetAppointmentsQuerySchema, CreateAppointmentSchema, RejectAppointmentSchema } from '@src/dtos/appointment.dto';

describe('Unit Test Appointment DTO - SQA Full Suite (11 Cases)', () => {
    
    it('TC_BS_LH_DTO_01 - CreateAppointmentSchema: Hợp lệ tất cả các trường', () => {
        const data = {
            doctorId: '550e8400-e29b-41d4-a716-446655440000',
            patientId: '550e8400-e29b-41d4-a716-446655440001',
            startTime: new Date(Date.now() + 86400000).toISOString(),
            reason: 'Khám sức khỏe định kỳ trên 10 ký tự',
            type: 'new'
        };
        const result = CreateAppointmentSchema.safeParse(data);
        expect(result.success).toBe(true);
    });

    it('TC_BS_LH_DTO_02 - CreateAppointmentSchema: Thất bại khi thiếu doctorId', () => {
        const data = { reason: 'Test missing field' };
        const result = CreateAppointmentSchema.safeParse(data);
        expect(result.success).toBe(false);
    });

    it('TC_BS_LH_DTO_03 - CreateAppointmentSchema: Thất bại khi sai định dạng startTime', () => {
        const data = { doctorId: '550e8400-e29b-41d4-a716-446655440000', startTime: 'invalid-date' };
        const result = CreateAppointmentSchema.safeParse(data);
        expect(result.success).toBe(false);
    });

    it('TC_BS_LH_DTO_04 - RejectAppointmentSchema: Lý do từ chối hợp lệ (BVA)', () => {
        const data = { reasonCancel: 'Bác sĩ bận lịch phẫu thuật đột xuất' };
        const result = RejectAppointmentSchema.safeParse(data);
        expect(result.success).toBe(true);
    });

    it('TC_BS_LH_DTO_05 - RejectAppointmentSchema: Thất bại khi lý do quá ngắn (BVA)', () => {
        const data = { reasonCancel: 'Bận' };
        const result = RejectAppointmentSchema.safeParse(data);
        expect(result.success).toBe(false);
    });

    it('TC_BS_LH_DTO_06 - QuerySchema: Hợp lệ khi lọc theo status', () => {
        const data = { status: 'pending' };
        const result = GetAppointmentsQuerySchema.safeParse(data);
        expect(result.success).toBe(true);
    });

    it('TC_BS_LH_DTO_07 - CreateAppointmentSchema: Thất bại khi ngày trong quá khứ (BVA)', () => {
        const data = {
            doctorId: '550e8400-e29b-41d4-a716-446655440000',
            startTime: '2020-01-01T10:00:00.000Z',
            reason: 'Lý do hợp lệ'
        };
        const result = CreateAppointmentSchema.safeParse(data);
        expect(result.success).toBe(false);
    });

    it('TC_BS_LH_DTO_08 - Common: Thất bại khi UUID sai định dạng', () => {
        const data = { patientId: '123-abc' };
        const result = GetAppointmentsQuerySchema.safeParse(data);
        expect(result.success).toBe(false);
    });

    it('TC_BS_LH_DTO_09 - Common: Thất bại khi lý do quá dài', () => {
        const data = { reason: 'A'.repeat(1001) };
        const result = CreateAppointmentSchema.safeParse(data);
        expect(result.success).toBe(false);
    });

    it('TC_BS_LH_DTO_10 - Common: Thất bại khi sai loại cuộc hẹn (EP)', () => {
        const data = { type: 'invalid_type' };
        const result = CreateAppointmentSchema.safeParse(data);
        expect(result.success).toBe(false);
    });

    it('TC_BS_LH_DTO_11 - Lọc theo trạng thái "Đã từ chối" (Rejected) - [MISSING FEATURE]', () => {
        const query = { status: 'rejected' };
        const result = GetAppointmentsQuerySchema.safeParse(query);
        // MONG ĐỢI: true (để báo lỗi khi thực tế trả về false)
        expect(result.success).toBe(true); 
    });
});
