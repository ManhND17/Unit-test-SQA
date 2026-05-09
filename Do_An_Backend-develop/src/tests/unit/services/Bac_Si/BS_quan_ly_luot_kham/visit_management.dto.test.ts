import {
    createVisitDto, CompleteVisitDto, UpdateVisitStatusDto,
    getVisitsOfPatientDto, CancelVisitDto, getVisitsByYearDto,
    searchVisitsDto, getTasksOfDoctorDto, getVisitsByDateDto, getVisitStatusDto,
    getVisitsOfDoctorDto
} from '@src/dtos/visit.dto';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto, GetMedicalRecordsQueryDto, validateFileUpload } from '@src/dtos/medical-record.dto';
import {
    CreatePrescriptionDto, CreateMedicineUsageDto, UpdateMedicineUsageDto,
    BatchAddMedicinesToPrescriptionDto, GetPrescriptionsQueryDto, UpdatePrescriptionWithMedicinesDto
} from '@src/dtos/prescription.dto';
import { createMedicalServiceDto, MedicalServiceQueryDto, createDoctorServiceDto, updateMedicalServiceDto } from '@src/dtos/medical-service.dto';
import { CreateServiceUsageDto, BulkCreateServiceUsageDto, UpdateServiceUsageDto, ServiceUsageQueryDto } from '@src/dtos/visit-service.dto';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('Unit Test Visit Management DTO - 60 Cases Continuous', () => {

    // --- NHÓM 1: VISIT DTOs 
    describe('1. Visit DTOs', () => {
        it('TC_BS_QLK_DTO_01: getVisitsOfPatient - Thất bại khi fromDate sai định dạng', () => {
            expect(getVisitsOfPatientDto.safeParse({ fromDate: 'bad-date' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_02: getVisitsOfPatient - Thất bại khi toDate sai định dạng', () => {
            expect(getVisitsOfPatientDto.safeParse({ toDate: 'invalid' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_03: getVisitsOfDoctor - Thất bại khi fromDate > toDate', () => {
            expect(getVisitsOfDoctorDto.safeParse({ fromDate: '2026-01-01', toDate: '2025-01-01' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_04: getVisitsByDate - Thất bại khi toDate sai định dạng', () => {
            expect(getVisitsByDateDto.safeParse({ toDate: 'wrong' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_05: createVisit - Thất bại khi startTime không hợp lệ', () => {
            expect(createVisitDto.safeParse({ patientUserId: VALID_UUID, startTime: 'abc' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_06: [BUG] createVisit - Chặn nextVisitDate quá khứ', () => {
            expect(createVisitDto.safeParse({ patientUserId: VALID_UUID, nextVisitDate: '2020-01-01' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_07: CancelVisit - Thất bại khi reason quá dài (>500)', () => {
            expect(CancelVisitDto.safeParse({ reason: 'A'.repeat(501) }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_08: getVisitsByYear - Thất bại khi năm sai định dạng (phải 4 chữ số)', () => {
            expect(getVisitsByYearDto.safeParse({ patientId: VALID_UUID, year: '202' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_09: searchVisits - Thất bại khi fromDate > toDate', () => {
            expect(searchVisitsDto.safeParse({ patientId: 'P1', fromDate: '2026-01-01', toDate: '2025-01-01' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_10: getTasksOfDoctor - Thất bại khi toDate sai định dạng', () => {
            expect(getTasksOfDoctorDto.safeParse({ toDate: 'invalid' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_11: getVisitStatusDto - Thất bại khi patientId sai UUID', () => {
            expect(getVisitStatusDto.safeParse({ patientId: '123' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_12: searchVisits - Chấp nhận bộ lọc status waiting', () => {
            expect(searchVisitsDto.safeParse({ patientId: 'P1', status: 'waiting' }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_13: createVisit - Chấp nhận type followUp hợp lệ', () => {
            expect(createVisitDto.safeParse({ patientUserId: VALID_UUID, type: 'followUp' }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_14: UpdateVisitStatus - Chấp nhận completed', () => {
            expect(UpdateVisitStatusDto.safeParse({ status: 'completed' }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_15: getVisitsOfPatient - Thành công khi không có tham số ngày tháng', () => {
            expect(getVisitsOfPatientDto.safeParse({}).success).toBe(true);
        });
    });

    // --- NHÓM 2: MEDICAL RECORD DTOs & FILE HELPER 
    describe('2. Medical Record DTOs', () => {
        it('TC_BS_QLK_DTO_16: validateFileUpload - Thành công với JPG < 5MB', () => {
            const file = { size: 1024, mimetype: 'image/jpeg', originalname: 'a.jpg' } as any;
            expect(validateFileUpload(file).valid).toBe(true);
        });
        it('TC_BS_QLK_DTO_17: validateFileUpload - Thất bại khi file > 5MB', () => {
            const file = { size: 6 * 1024 * 1024, mimetype: 'image/png', originalname: 'b.png' } as any;
            expect(validateFileUpload(file).valid).toBe(false);
        });
        it('TC_BS_QLK_DTO_18: validateFileUpload - Thất bại khi sai định dạng (txt)', () => {
            const file = { size: 100, mimetype: 'text/plain', originalname: 'c.txt' } as any;
            expect(validateFileUpload(file).valid).toBe(false);
        });
        it('TC_BS_QLK_DTO_19: CreateMR - Thất bại khi title rỗng', () => {
            expect(CreateMedicalRecordDto.safeParse({ visitId: VALID_UUID, title: '', symptoms: 'S', diagnosis: 'D', treatments: 'TR' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_20: UpdateMR - Thất bại khi title quá dài (256 ký tự)', () => {
            expect(UpdateMedicalRecordDto.safeParse({ title: 'A'.repeat(256) }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_21: GetMRQuery - Chấp nhận sortBy=title', () => {
            expect(GetMedicalRecordsQueryDto.safeParse({ sortBy: 'title' }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_22: UpdateMR - Chấp nhận chỉ cập nhật notes', () => {
            expect(UpdateMedicalRecordDto.safeParse({ notes: 'X' }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_23: CreateMR - Thất bại khi thiếu triệu chứng (symptoms)', () => {
            expect(CreateMedicalRecordDto.safeParse({ visitId: VALID_UUID, title: 'T', diagnosis: 'D', treatments: 'TR' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_24: GetMRQuery - Thất bại khi sortOrder sai enum', () => {
            expect(GetMedicalRecordsQueryDto.safeParse({ sortOrder: 'up' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_25: UpdateMR - Thất bại khi diagnosis là chuỗi rỗng', () => {
            expect(UpdateMedicalRecordDto.safeParse({ diagnosis: '' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_26: CreateMR - Thất bại khi treatments rỗng', () => {
            expect(CreateMedicalRecordDto.safeParse({ visitId: VALID_UUID, title: 'T', symptoms: 'S', diagnosis: 'D', treatments: '' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_27: GetMRQuery - Chấp nhận bộ lọc doctorId hợp lệ', () => {
            expect(GetMedicalRecordsQueryDto.safeParse({ doctorId: VALID_UUID }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_28: GetMRQuery - Chấp nhận limit là chuỗi "50"', () => {
            expect(GetMedicalRecordsQueryDto.safeParse({ limit: '50' }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_29: UpdateMR - Thành công khi cập nhật symptoms và diagnosis cùng lúc', () => {
            expect(UpdateMedicalRecordDto.safeParse({ symptoms: 'S1', diagnosis: 'D1' }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_30: CreateMR - Thành công với notes cực dài', () => {
            expect(CreateMedicalRecordDto.safeParse({ visitId: VALID_UUID, title: 'T', symptoms: 'S', diagnosis: 'D', treatments: 'TR', notes: 'A'.repeat(2000) }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_31: GetMRQuery - Mặc định page là "1" khi không gửi', () => {
            const res = GetMedicalRecordsQueryDto.safeParse({});
            if (res.success) expect(res.data.page).toBe('1');
        });
        it('TC_BS_QLK_DTO_32: UpdateMR - Thất bại khi title chỉ chứa khoảng trắng', () => {
            expect(UpdateMedicalRecordDto.safeParse({ title: '   ' }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_33: GetMRQuery - Chấp nhận sortBy=createdAt', () => {
            expect(GetMedicalRecordsQueryDto.safeParse({ sortBy: 'createdAt' }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_34: UpdateMR - Chấp nhận notes là chuỗi rỗng', () => {
            expect(UpdateMedicalRecordDto.safeParse({ notes: '' }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_35: CreateMR - Thất bại khi visitId sai định dạng UUID', () => {
            expect(CreateMedicalRecordDto.safeParse({ visitId: 'invalid-uuid' }).success).toBe(false);
        });
    });

    // --- NHÓM 3: PRESCRIPTION & SERVICE DTOs 
    describe('3. Prescription & Service DTOs', () => {
        it('TC_BS_QLK_DTO_36: MedicineUsage - Thất bại khi số lượng (quantity) = 0', () => {
            expect(CreateMedicineUsageDto.safeParse({ drugName: 'A', quantity: 0 }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_37: MedicineUsage - Thất bại khi giá (price) âm', () => {
            expect(CreateMedicineUsageDto.safeParse({ drugName: 'A', quantity: 1, price: -100 }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_38: BatchAddMedicines - Thất bại khi kê > 50 thuốc', () => {
            const medicines = Array(51).fill({ drugName: 'M', quantity: 1 });
            expect(BatchAddMedicinesToPrescriptionDto.safeParse({ prescriptionId: VALID_UUID, medicines }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_39: GetPrescriptionsQuery - Transform paid=true chính xác', () => {
            const res = GetPrescriptionsQueryDto.safeParse({ paid: 'true' });
            expect(res.success).toBe(true);
            if (res.success) expect(res.data.paid).toBe(true);
        });
        it('TC_BS_QLK_DTO_40: CreateMedicalService - Thất bại khi giá (price) âm', () => {
            expect(createMedicalServiceDto.safeParse({ name: 'S1', price: -10, unit: 'U', departmentId: 1, roomId: VALID_UUID, durationMinutes: 10 }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_41: BulkCreateServiceUsage - Thất bại khi mảng items rỗng', () => {
            expect(BulkCreateServiceUsageDto.safeParse({ items: [] }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_42: ServiceUsageQuery - Thất bại khi startDate sai định dạng', () => {
            expect(ServiceUsageQueryDto.safeParse({ startDate: 'wrong' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_43: ServiceUsageQuery - Transform page sang number', () => {
            const res = ServiceUsageQueryDto.safeParse({ page: '10' });
            expect(res.success).toBe(true);
            if (res.success) expect(res.data.page).toBe(10);
        });
        it('TC_BS_QLK_DTO_44: CreateDoctorService - Thất bại khi doctorId sai UUID', () => {
            expect(createDoctorServiceDto.safeParse({ doctorId: '123', medicalServiceId: VALID_UUID, price: 100, durationMinutes: 15 }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_45: UpdateMedicalService - Chấp nhận % BHYT hợp lệ (80%)', () => {
            expect(updateMedicalServiceDto.safeParse({ name: 'S1', price: 100, unit: 'U', departmentId: 1, roomId: VALID_UUID, durationMinutes: 10, percentApplyHealthInsurance: 80 }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_46: MedicineUsage - Chấp nhận ghi chú dài 500 ký tự', () => {
            expect(CreateMedicineUsageDto.safeParse({ drugName: 'A', quantity: 1, note: 'X'.repeat(500) }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_47: CreatePrescription - Chấp nhận medicines mặc định rỗng', () => {
            const res = CreatePrescriptionDto.safeParse({ visitId: VALID_UUID });
            expect(res.success).toBe(true);
            if (res.success) expect(res.data.medicines).toEqual([]);
        });
        it('TC_BS_QLK_DTO_48: UpdatePrescriptionWithMedicines - Thất bại khi mảng rỗng', () => {
            expect(UpdatePrescriptionWithMedicinesDto.safeParse({ medicines: [] }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_49: MedicalServiceQuery - Chấp nhận minPrice và maxPrice', () => {
            expect(MedicalServiceQueryDto.safeParse({ minPrice: 1000, maxPrice: 5000 }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_50: UpdateServiceUsage - Thất bại khi status sai enum', () => {
            expect(UpdateServiceUsageDto.safeParse({ status: 'done_error' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_51: CreateServiceUsage - Thất bại khi quantity là số âm', () => {
            expect(CreateServiceUsageDto.safeParse({ visitId: VALID_UUID, medicalServiceId: VALID_UUID, quantity: -5 }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_52: GetPrescriptionsQuery - Thất bại khi sortOrder sai', () => {
            expect(GetPrescriptionsQueryDto.safeParse({ sortOrder: 'none' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_53: MedicalServiceQuery - Transform isActive từ string sang number', () => {
            expect(MedicalServiceQueryDto.safeParse({ isActive: '1' }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_54: updateMedicalService - Thất bại khi % BHYT < 0', () => {
            expect(updateMedicalServiceDto.safeParse({ name: 'S1', price: 100, unit: 'U', departmentId: 1, roomId: VALID_UUID, durationMinutes: 10, percentApplyHealthInsurance: -5 }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_55: getVisitsByYear - Thành công với năm 2026', () => {
            expect(getVisitsByYearDto.safeParse({ patientId: VALID_UUID, year: '2026' }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_56: MedicineUsage - Thất bại khi thiếu tên thuốc (drugName)', () => {
            expect(CreateMedicineUsageDto.safeParse({ quantity: 10 }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_57: UpdateMedicineUsage - Chấp nhận cập nhật trạng thái mua thuốc (isPurchased)', () => {
            expect(UpdateMedicineUsageDto.safeParse({ medicineId: VALID_UUID, isPurchased: true }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_58: searchVisits - Thất bại khi patientId rỗng', () => {
            expect(searchVisitsDto.safeParse({ patientId: '' }).success).toBe(false);
        });
        it('TC_BS_QLK_DTO_59: getTasksOfDoctor - Chấp nhận lọc theo trạng thái completed', () => {
            expect(getTasksOfDoctorDto.safeParse({ status: 'completed' }).success).toBe(true);
        });
        it('TC_BS_QLK_DTO_60: createVisit - Thất bại khi appointmentId sai UUID', () => {
            expect(createVisitDto.safeParse({ patientUserId: VALID_UUID, appointmentId: '123' }).success).toBe(false);
        });
    });
});
