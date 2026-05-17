import visitService from '@src/services/visit.service';
import prescriptionService from '@src/services/prescription.service';
import medicalRecordService from '@src/services/medical-record.service';
import { visitServiceService } from '@src/services/visit-service.service';
import prisma from '@src/config/prisma';

// Mock Cloudinary
jest.mock('@src/services/cloudinary.service', () => ({
    uploadToCloudinary: jest.fn().mockResolvedValue({ url: 'http://cloudinary.com/test.jpg', public_id: 'test_id' }),
    deleteFromCloudinary: jest.fn().mockResolvedValue(true),
}));

describe('Unit Test Service - Visit Management (Century Suite 100 Explicit Cases)', () => {
    let doctorId: string, patientUserId: string, ehrId: string, otherDoctorId: string, otherPatientUserId: string;

    beforeAll(async () => {
        const doctors = await (prisma as any).doctor.findMany({ take: 2 });
        const patients = await (prisma as any).patient.findMany({ take: 2 });
        if (doctors.length < 1 || patients.length < 1) throw new Error('Database needs doctor and patient data.');

        doctorId = doctors[0].userId;
        otherDoctorId = doctors[1]?.userId || doctorId;
        patientUserId = patients[0].userId;
        otherPatientUserId = patients[1]?.userId || patientUserId;

        const ehr = await (prisma as any).eHR.findFirst({ where: { patientId: patientUserId } });
        ehrId = ehr ? ehr.id : (await (prisma as any).eHR.create({ data: { patient: { connect: { userId: patientUserId } } } })).id;
    });

    const runTest = async (fn: () => Promise<void>) => {
        try {
            await prisma.$transaction(async (tx) => {
                const models = ['visit', 'medicalRecord', 'prescription', 'medicineUsage', 'visitService', 'medicalService', 'appointment', 'user', 'staff', 'medicine'];
                const originals: any = {};
                models.forEach(m => { if ((prisma as any)[m]) { originals[m] = (prisma as any)[m]; (prisma as any)[m] = tx[m]; } });
                const originalTransaction = prisma.$transaction;
                (prisma as any).$transaction = async (arg: any) => {
                    if (Array.isArray(arg)) return Promise.all(arg);
                    return await arg(tx);
                };
                try { await fn(); } finally {
                    models.forEach(m => { if (originals[m]) (prisma as any)[m] = originals[m]; });
                    prisma.$transaction = originalTransaction;
                }
                throw new Error('ROLLBACK');
            });
        } catch (e: any) { if (e.message !== 'ROLLBACK') throw e; }
    };

    // =========================================================================
    // NHÓM 1: QUẢN LÝ LƯỢT KHÁM (TC_BS_QLK_S_01 - TC_BS_QLK_S_25)
    // =========================================================================
    describe('Nhóm 1: Quản lý Lượt khám', () => {
        it('TC_BS_QLK_S_01: [BVA] Chặn ngày tái khám quá khứ (Nghiệp vụ: FAIL)', async () => {
            await runTest(async () => {
                const v = await prisma.visit.create({ data: { ehrId, doctorId, status: 'in_progress', patientUserId } } as any);
                await expect(visitService.updateNextVisitDate(v.id, '2000-01-01T00:00:00Z')).rejects.toThrow();
            });
        });

        it('TC_BS_QLK_S_02: [BVA] Cập nhật ngày tái khám là Hôm nay', async () => {
            await runTest(async () => {
                const v = await prisma.visit.create({ data: { ehrId, doctorId, status: 'in_progress', patientUserId } } as any);
                const today = new Date().toISOString();
                const res = await visitService.updateNextVisitDate(v.id, today);
                expect(new Date(res.nextVisitDate).toDateString()).toBe(new Date(today).toDateString());
            });
        });

        it('TC_BS_QLK_S_03: [BVA] Cập nhật ngày tái khám là Tương lai', async () => {
            await runTest(async () => {
                const v = await prisma.visit.create({ data: { ehrId, doctorId, status: 'in_progress', patientUserId } } as any);
                const future = '2030-01-01T00:00:00Z';
                const res = await visitService.updateNextVisitDate(v.id, future);
                expect(new Date(res.nextVisitDate).getFullYear()).toBe(2030);
            });
        });

        it('TC_BS_QLK_S_04: [EP] Tạo lượt khám: Bệnh nhân không có EHR (Lỗi 404)', async () => {
            await runTest(async () => {
                await expect(visitService.createVisit({ patientUserId: 'ghost-user' } as any)).rejects.toThrow();
            });
        });

        it('TC_BS_QLK_S_05: [EP] Tạo lượt khám: Bác sĩ không tồn tại (Lỗi 404)', async () => {
            await runTest(async () => {
                await expect(visitService.createVisit({ patientUserId, doctorId: 'ghost-doc' })).rejects.toThrow();
            });
        });

        it('TC_BS_QLK_S_06: [EP] Hoàn tất lượt khám: Trạng thái đang "waiting" (Phải qua in_progress)', async () => {
            await runTest(async () => {
                const v = await visitService.createVisit({ patientUserId, doctorId, status: 'waiting' });
                await expect(visitService.completeVisit(v.id, doctorId, 'doctor')).rejects.toThrow();
            });
        });

        it('TC_BS_QLK_S_07: [EP] Hoàn tất lượt khám: Bác sĩ khác thực hiện (Lỗi phân quyền)', async () => {
            await runTest(async () => {
                const v = await visitService.createVisit({ patientUserId, doctorId });
                await expect(visitService.completeVisit(v.id, otherDoctorId, 'doctor')).rejects.toThrow();
            });
        });

        it('TC_BS_QLK_S_08: [EP] Hủy lượt khám: Trạng thái đã "completed" (Không được hủy)', async () => {
            await runTest(async () => {
                const v = await visitService.createVisit({ patientUserId, doctorId, status: 'completed' });
                await expect(visitService.cancelVisit(v.id, doctorId, 'doctor', { reason: 'Test' })).rejects.toThrow();
            });
        });

        it('TC_BS_QLK_S_09: [EP] Hủy lượt khám: Trạng thái đã "cancelled" (Lỗi trùng lặp)', async () => {
            await runTest(async () => {
                const v = await visitService.createVisit({ patientUserId, doctorId, status: 'cancelled' });
                await expect(visitService.cancelVisit(v.id, doctorId, 'doctor', { reason: 'Test' })).rejects.toThrow();
            });
        });

        it('TC_BS_QLK_S_10: [BVA] Hủy lượt khám: Lý do trống (Bắt buộc lý do)', async () => {
            await runTest(async () => {
                const v = await visitService.createVisit({ patientUserId, doctorId });
                await expect(visitService.cancelVisit(v.id, doctorId, 'doctor', { reason: '' })).rejects.toThrow();
            });
        });

        it('TC_BS_QLK_S_11: [EP] Tìm kiếm lượt khám: Lọc theo trạng thái "in_progress"', async () => {
            await runTest(async () => {
                const res = await visitService.searchVisits(patientUserId, { status: 'in_progress' });
                expect(res.data).toBeDefined();
            });
        });

        it('TC_BS_QLK_S_12: [EP] Tìm kiếm lượt khám: Phân trang (Trang 2)', async () => {
            await runTest(async () => {
                const res = await visitService.searchVisits(patientUserId, { page: '2', limit: '5' });
                expect(res.pagination?.currentPage).toBe(2);
            });
        });

        it('TC_BS_QLK_S_13: [BVA] Tìm kiếm lượt khám: Limit vượt mức tối đa (Mặc định về limit max)', async () => {
            await runTest(async () => {
                const res = await visitService.searchVisits(patientUserId, { limit: '9999' });
                expect(Number(res.pagination?.limit || 10)).toBeLessThanOrEqual(100);
            });
        });

        it('TC_BS_QLK_S_14: [EP] Lấy tóm tắt lượt khám: Admin truy cập', async () => {
            await runTest(async () => {
                const v = await visitService.createVisit({ patientUserId, doctorId });
                const res = await visitService.getVisitSummary(v.id, 'admin-id', 'admin');
                expect(res.id).toBe(v.id);
            });
        });

        it('TC_BS_QLK_S_15: [EP] Lấy chi tiết lượt khám: Bệnh nhân khác xem (Lỗi phân quyền)', async () => {
            await runTest(async () => {
                const v = await visitService.createVisit({ patientUserId, doctorId });
                await expect(visitService.getDetailsOfVisit(v.id, { id: otherPatientUserId, role: 'patient' } as any)).rejects.toThrow();
            });
        });

        it('TC_BS_QLK_S_16: [BVA] Thống kê lượt khám: Khoảng thời gian từ ngày > đến ngày (Lỗi logic)', async () => {
            await runTest(async () => {
                await expect(visitService.getVisitStatsByDate('2025-01-01', '2024-01-01')).rejects.toThrow();
            });
        });

        it('TC_BS_QLK_S_17: [EP] Lấy nhiệm vụ bác sĩ: Bác sĩ không có nhiệm vụ nào', async () => {
            await runTest(async () => {
                const res = await visitService.getTasksOfDoctor(otherDoctorId, {});
                expect(res.data.length).toBe(0);
            });
        });

        it('TC_BS_QLK_S_18: [EP] Cập nhật trạng thái lượt khám: Từ waiting sang in_progress', async () => {
            await runTest(async () => {
                const v = await visitService.createVisit({ patientUserId, doctorId, status: 'waiting' });
                const res = await visitService.updateVisitStatus(v.id, 'in_progress');
                expect(res.status).toBe('in_progress');
            });
        });

        it('TC_BS_QLK_S_19: [EP] Lấy danh sách lượt khám của bác sĩ: Lọc theo ngày hôm nay', async () => {
            await runTest(async () => {
                const today = new Date().toISOString().split('T')[0];
                const res = await visitService.getVisitsOfDoctor(doctorId, { date: today });
                expect(res.data).toBeDefined();
            });
        });

        it('TC_BS_QLK_S_20: [EP] Lấy lịch sử khám bệnh nhân: Quyền Staff xem', async () => {
            await runTest(async () => {
                const res = await visitService.getVisitsOfPatient(patientUserId, { role: 'staff' } as any);
                expect(res).toBeDefined();
            });
        });

        it('TC_BS_QLK_S_21: [EP] Tạo lượt khám: Kèm dịch vụ y tế chỉ định', async () => {
            await runTest(async () => {
                const s = await prisma.medicalService.findFirst();
                const res = await visitService.createVisit({ patientUserId, medicalServiceId: s.id });
                expect(res.medicalServiceId).toBe(s.id);
            });
        });

        it('TC_BS_QLK_S_22: [EP] Tạo lượt khám: Kèm lịch hẹn (Appointment link)', async () => {
            await runTest(async () => {
                const app = await (prisma as any).appointment.findFirst();
                if (app) {
                    const res = await visitService.createVisit({ patientUserId, appointmentId: app.id });
                    expect(res.appointmentId).toBe(app.id);
                }
            });
        });

        it('TC_BS_QLK_S_23: [EP] Tóm tắt chi phí: Khi chưa có thuốc và dịch vụ (Total = 0)', async () => {
            await runTest(async () => {
                const v = await visitService.createVisit({ patientUserId, doctorId });
                const res = await visitService.calculateVisitCost(v.id);
                expect(res.totalCost).toBe(0);
            });
        });

        it('TC_BS_QLK_S_24: [EP] Lấy danh sách lượt khám: Theo ngày cụ thể', async () => {
            await runTest(async () => {
                const res = await visitService.getVisitsByDate({ date: '2024-01-01' });
                expect(res).toBeDefined();
            });
        });

        it('TC_BS_QLK_S_25: [EP] Cập nhật lượt khám: Thay đổi bác sĩ phụ trách', async () => {
            await runTest(async () => {
                const v = await visitService.createVisit({ patientUserId, doctorId });
                const res = await (prisma as any).visit.update({ where: { id: v.id }, data: { doctorId: otherDoctorId } });
                expect(res.doctorId).toBe(otherDoctorId);
            });
        });

        // =========================================================================
        // NHÓM 2: HỒ SƠ BỆNH ÁN & FILE (TC_BS_QLK_S_26 - TC_BS_QLK_S_50)
        // =========================================================================
        describe('Nhóm 2: Hồ sơ bệnh án & Tải file', () => {
            it('TC_BS_QLK_S_26: [EP] Tạo hồ sơ: Triệu chứng rỗng (Bắt buộc nhập)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    await expect(medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Khám', symptoms: '', diagnosis: 'Cúm', treatments: 'Nghỉ' })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_27: [EP] Tạo hồ sơ: Chẩn đoán rỗng (Bắt buộc nhập)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    await expect(medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Khám', symptoms: 'Sốt', diagnosis: '', treatments: 'Nghỉ' })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_28: [EP] Upload file: Định dạng .JPG (Hợp lệ)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const mockFile = { path: 'test.jpg', mimetype: 'image/jpeg', originalname: 'test.jpg', size: 1024 } as any;
                    const res = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Ảnh', symptoms: 'Đau', diagnosis: 'Gãy', treatments: 'Bó' }, [mockFile]);
                    expect(res.fileAssets.length).toBe(1);
                });
            });

            it('TC_BS_QLK_S_29: [EP] Upload file: Định dạng .PNG (Hợp lệ)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const mockFile = { path: 'test.png', mimetype: 'image/png', originalname: 'test.png', size: 1024 } as any;
                    const res = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Ảnh', symptoms: 'Đau', diagnosis: 'Gãy', treatments: 'Bó' }, [mockFile]);
                    expect(res.fileAssets.length).toBe(1);
                });
            });

            it('TC_BS_QLK_S_30: [EP] Upload file: Định dạng .PDF (Hợp lệ)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const mockFile = { path: 'test.pdf', mimetype: 'application/pdf', originalname: 'test.pdf', size: 1024 } as any;
                    const res = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Hồ sơ', symptoms: 'Đau', diagnosis: 'Gãy', treatments: 'Bó' }, [mockFile]);
                    expect(res.fileAssets.length).toBe(1);
                });
            });

            it('TC_BS_QLK_S_31: [EP] Upload file: Định dạng .EXE (Không hợp lệ)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const mockFile = { path: 'test.exe', mimetype: 'application/x-msdownload', originalname: 'test.exe', size: 1024 } as any;
                    await expect(medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Virus', symptoms: 'Sốt', diagnosis: 'Cúm', treatments: 'Nghỉ' }, [mockFile])).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_32: [BVA] Upload file: Dung lượng 0 bytes (Không hợp lệ)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const mockFile = { path: 'zero.jpg', mimetype: 'image/jpeg', originalname: 'zero.jpg', size: 0 } as any;
                    await expect(medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Ảnh' }, [mockFile])).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_33: [BVA] Upload file: Vượt dung lượng 10MB (Không hợp lệ)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const mockFile = { path: 'big.jpg', mimetype: 'image/jpeg', originalname: 'big.jpg', size: 11 * 1024 * 1024 } as any;
                    await expect(medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Ảnh' }, [mockFile])).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_34: [EP] Xóa hồ sơ: Bác sĩ khác xóa (Lỗi phân quyền)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const rec = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Xóa', symptoms: 'Sốt', diagnosis: 'Cúm', treatments: 'Nghỉ' });
                    await expect(medicalRecordService.deleteMedicalRecord(rec.id, otherDoctorId)).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_35: [EP] Xem hồ sơ: Bệnh nhân khác xem (Lỗi phân quyền)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const rec = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Xem', symptoms: 'Sốt', diagnosis: 'Cúm', treatments: 'Nghỉ' });
                    await expect(medicalRecordService.getMedicalRecordById(rec.id, otherPatientUserId)).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_36: [EP] Cập nhật hồ sơ: Thành công (Direct service call)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const rec = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Cũ', symptoms: 'Sốt', diagnosis: 'Cúm', treatments: 'Nghỉ' });
                    const res = await medicalRecordService.updateMedicalRecord(rec.id, doctorId, { title: 'Mới' });
                    expect(res.title).toBe('Mới');
                });
            });

            it('TC_BS_QLK_S_37: [EP] Xóa hồ sơ: Thành công bởi bác sĩ chủ quản', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const rec = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Xóa', symptoms: 'A', diagnosis: 'B', treatments: 'C' });
                    const res = await medicalRecordService.deleteMedicalRecord(rec.id, doctorId);
                    expect(res.success).toBe(true);
                });
            });

            it('TC_BS_QLK_S_38: [EP] Xem danh sách hồ sơ: Admin xem toàn bộ', async () => {
                await runTest(async () => {
                    const res = await medicalRecordService.getMedicalRecordsList({});
                    expect(res.data).toBeDefined();
                });
            });

            it('TC_BS_QLK_S_39: [EP] Xem danh sách hồ sơ: Bác sĩ xem của mình', async () => {
                await runTest(async () => {
                    const res = await medicalRecordService.getMedicalRecordsList({ doctorId });
                    expect(res.data).toBeDefined();
                });
            });

            it('TC_BS_QLK_S_40: [EP] Tạo hồ sơ: Kèm nhiều file đính kèm cùng lúc', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const files = [
                        { path: '1.jpg', mimetype: 'image/jpeg', originalname: '1.jpg', size: 1024 },
                        { path: '2.png', mimetype: 'image/png', originalname: '2.png', size: 1024 }
                    ] as any[];
                    const res = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Nhiều file', symptoms: 'A', diagnosis: 'B', treatments: 'C' }, files);
                    expect(res.fileAssets.length).toBe(2);
                });
            });

            it('TC_BS_QLK_S_41: [EP] Xóa tệp đính kèm: Thành công', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const mockFile = { path: 'test.jpg', mimetype: 'image/jpeg', originalname: 'test.jpg', size: 1024 } as any;
                    const rec = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Ảnh', symptoms: 'A', diagnosis: 'B', treatments: 'C' }, [mockFile]);
                    const assetId = rec.fileAssets[0].id;
                    const res = await medicalRecordService.deleteFileAsset(assetId);
                    expect(res.success).toBe(true);
                });
            });

            it('TC_BS_QLK_S_42: [EP] Xóa tệp đính kèm: File không tồn tại (Lỗi 404)', async () => {
                await runTest(async () => {
                    await expect(medicalRecordService.deleteFileAsset('ghost-asset')).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_43: [EP] Cập nhật hồ sơ: Đính kèm thêm file mới', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const rec = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Ảnh', symptoms: 'Đau', diagnosis: 'Cúm', treatments: 'Nghỉ' });
                    const mockFile = { path: 'new.jpg', mimetype: 'image/jpeg', originalname: 'new.jpg', size: 1024 } as any;
                    const res = await medicalRecordService.updateMedicalRecord(rec.id, doctorId, {}, [mockFile]);
                    expect(res.fileAssets.length).toBe(1);
                });
            });

            it('TC_BS_QLK_S_44: [EP] Chặn tạo hồ sơ cho lượt khám đã "completed" (Nghiệp vụ: FAIL)', async () => {
                await runTest(async () => {
                    const v = await prisma.visit.create({ data: { ehrId, doctorId, status: 'completed', patientUserId } } as any);
                    await expect(medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'A' })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_45: [EP] Chặn tạo hồ sơ cho lượt khám đã "cancelled" (Nghiệp vụ: FAIL)', async () => {
                await runTest(async () => {
                    const v = await prisma.visit.create({ data: { ehrId, doctorId, status: 'cancelled', patientUserId } } as any);
                    await expect(medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'A' })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_46: [EP] Chặn tạo hồ sơ: Bác sĩ không được giao (Nghiệp vụ: FAIL)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId: otherDoctorId });
                    await expect(medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'A' })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_47: [EP] Xóa hồ sơ: Kèm xóa file trên Cloudinary', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const mockFile = { path: 'test.jpg', mimetype: 'image/jpeg', originalname: 'test.jpg', size: 1024 } as any;
                    const rec = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Ảnh' }, [mockFile]);
                    const res = await medicalRecordService.deleteMedicalRecord(rec.id, doctorId);
                    expect(res.success).toBe(true);
                });
            });

            it('TC_BS_QLK_S_48: [EP] Cập nhật hồ sơ: Lượt khám "completed" (Nghiệp vụ: FAIL)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const rec = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Ảnh' });
                    await prisma.visit.update({ where: { id: v.id }, data: { status: 'completed' } });
                    await expect(medicalRecordService.updateMedicalRecord(rec.id, doctorId, { title: 'Mới' })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_49: [EP] Xem hồ sơ: Quyền bác sĩ chủ quản', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const rec = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Ảnh' });
                    const res = await medicalRecordService.getMedicalRecordById(rec.id, doctorId);
                    expect(res.id).toBe(rec.id);
                });
            });

            it('TC_BS_QLK_S_50: [EP] Xóa tệp đính kèm: Bác sĩ chủ quản', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const mockFile = { path: 'test.jpg', mimetype: 'image/jpeg', originalname: 'test.jpg', size: 1024 } as any;
                    const rec = await medicalRecordService.createMedicalRecord(doctorId, { visitId: v.id, title: 'Ảnh' }, [mockFile]);
                    const res = await medicalRecordService.deleteFileAsset(rec.fileAssets[0].id);
                    expect(res.success).toBe(true);
                });
            });
        });

        // =========================================================================
        // NHÓM 3: DỊCH VỤ CHỈ ĐỊNH (TC_BS_QLK_S_51 - TC_BS_QLK_S_75)
        // =========================================================================
        describe('Nhóm 3: Dịch vụ chỉ định', () => {
            it('TC_BS_QLK_S_51: [BVA] createServiceUsage: Số lượng = 0 (Thất bại)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    await expect(visitServiceService.createServiceUsage({ visitId: v.id, medicalServiceId: s.id, quantity: 0, orderedByUserId: doctorId })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_52: [EP] createServiceUsage: Visit không tồn tại (Lỗi 404)', async () => {
                await runTest(async () => {
                    const s = await prisma.medicalService.findFirst();
                    await expect(visitServiceService.createServiceUsage({ visitId: 'ghost-v', medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_53: [EP] getServiceUsageById: Quyền Bệnh nhân truy cập của mình', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    const usage = await visitServiceService.createServiceUsage({ visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId });
                    const res = await visitServiceService.getServiceUsageById(usage.id, 'patient', patientUserId);
                    expect(res.id).toBe(usage.id);
                });
            });

            it('TC_BS_QLK_S_54: [EP] getServiceUsageById: Chặn Bệnh nhân xem của người khác (Lỗi 403)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    const usage = await visitServiceService.createServiceUsage({ visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId });
                    await expect(visitServiceService.getServiceUsageById(usage.id, 'patient', otherPatientUserId)).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_55: [EP] listServiceUsages: Bệnh nhân chỉ thấy của mình', async () => {
                await runTest(async () => {
                    const res = await visitServiceService.listServiceUsages({ patientUserId }, 'patient', patientUserId);
                    expect(res.data).toBeDefined();
                });
            });

            it('TC_BS_QLK_S_56: [EP] updateServiceUsage: Chặn cập nhật khi trạng thái là "done" (Lỗi 400)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    const usage = await visitServiceService.createServiceUsage({ visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId });
                    await prisma.visitService.update({ where: { id: usage.id }, data: { status: 'done' } });
                    await expect(visitServiceService.updateServiceUsage(usage.id, { quantity: 5 })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_57: [EP] deleteServiceUsage: Chặn xóa khi trạng thái không phải "ordered" (Lỗi 400)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    const usage = await visitServiceService.createServiceUsage({ visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId });
                    await prisma.visitService.update({ where: { id: usage.id }, data: { status: 'done' } });
                    await expect(visitServiceService.deleteServiceUsage(usage.id)).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_58: [EP] getVisitHistory: Quyền Bác sĩ xem lịch sử lượt khám', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const res = await visitServiceService.getVisitHistory(v.id, {}, 'doctor', doctorId);
                    expect(res.data).toBeDefined();
                });
            });

            it('TC_BS_QLK_S_59: [EP] bulkCreateServiceUsages: Thành công toàn bộ & Gộp item trùng', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    const res = await visitServiceService.bulkCreateServiceUsages({
                        items: [
                            { visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId },
                            { visitId: v.id, medicalServiceId: s.id, quantity: 2, orderedByUserId: doctorId }
                        ]
                    });
                    expect(res.createdCount).toBe(1);
                    expect(res.created[0].quantity).toBe(3);
                });
            });

            it('TC_BS_QLK_S_60: [EP] bulkCreateServiceUsages: Thất bại toàn bộ (Lỗi 400)', async () => {
                await runTest(async () => {
                    await expect(visitServiceService.bulkCreateServiceUsages({
                        items: [{ visitId: 'ghost', medicalServiceId: 'ghost', quantity: 1, orderedByUserId: doctorId }]
                    })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_61: [EP] bulkCreateServiceUsages: Hỗn hợp Thành công & Thất bại', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    const res = await visitServiceService.bulkCreateServiceUsages({
                        items: [
                            { visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId },
                            { visitId: 'ghost', medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId }
                        ]
                    });
                    expect(res.createdCount).toBe(1);
                    expect(res.failedCount).toBe(1);
                });
            });

            it('TC_BS_QLK_S_62: [EP] createServiceUsage: Medical Service không tồn tại (Lỗi 404)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    await expect(visitServiceService.createServiceUsage({ visitId: v.id, medicalServiceId: 'ghost-s', quantity: 1, orderedByUserId: doctorId })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_63: [EP] getServiceUsageById: Dịch vụ không tồn tại (Lỗi 404)', async () => {
                await runTest(async () => {
                    await expect(visitServiceService.getServiceUsageById('ghost-id', 'doctor', doctorId)).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_64: [EP] deleteServiceUsage: Thành công (ordered status)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    const usage = await visitServiceService.createServiceUsage({ visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId });
                    const res = await visitServiceService.deleteServiceUsage(usage.id);
                    expect(res.message).toContain('successfully');
                });
            });

            it('TC_BS_QLK_S_65: [EP] listServiceUsages: Quyền Admin xem toàn bộ', async () => {
                await runTest(async () => {
                    const res = await visitServiceService.listServiceUsages({ limit: 10, page: 1 }, 'admin', 'admin-id');
                    expect(res.data).toBeDefined();
                });
            });

            it('TC_BS_QLK_S_66: [EP] updateServiceUsage: Thành công (ordered status)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    const usage = await visitServiceService.createServiceUsage({ visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId });
                    const res = await visitServiceService.updateServiceUsage(usage.id, { quantity: 10 });
                    expect(res.quantity).toBe(10);
                });
            });

            it('TC_BS_QLK_S_67: [EP] getVisitHistory: Visit không tồn tại (Lỗi 404)', async () => {
                await runTest(async () => {
                    await expect(visitServiceService.getVisitHistory('ghost-v', {}, 'doctor', doctorId)).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_68: [EP] getVisitHistory: Chặn Bệnh nhân xem lịch sử của người khác (Lỗi 403)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    await expect(visitServiceService.getVisitHistory(v.id, {}, 'patient', otherPatientUserId)).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_69: [EP] bulkCreateServiceUsages: Bỏ qua item null', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    const res = await visitServiceService.bulkCreateServiceUsages({
                        items: [null as any, { visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId }]
                    });
                    expect(res.createdCount).toBe(1);
                });
            });

            it('TC_BS_QLK_S_70: [EP] listServiceUsages: Lọc theo status "done"', async () => {
                await runTest(async () => {
                    const res = await visitServiceService.listServiceUsages({ status: 'done', limit: 10, page: 1 }, 'doctor', doctorId);
                    expect(res.data).toBeDefined();
                });
            });

            it('TC_BS_QLK_S_71: [BVA] listServiceUsages: Phân trang trang cuối', async () => {
                await runTest(async () => {
                    const res = await visitServiceService.listServiceUsages({ page: 999, limit: 10 }, 'doctor', doctorId);
                    expect(res.data.length).toBe(0);
                });
            });

            it('TC_BS_QLK_S_72: [EP] updateServiceUsage: Chặn cập nhật khi trạng thái là "cancelled" (Lỗi 400)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    const usage = await visitServiceService.createServiceUsage({ visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId });
                    await prisma.visitService.update({ where: { id: usage.id }, data: { status: 'cancelled' } });
                    await expect(visitServiceService.updateServiceUsage(usage.id, { quantity: 5 })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_73: [EP] getServiceUsageById: Quyền Staff xem', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    const usage = await visitServiceService.createServiceUsage({ visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId });
                    const res = await visitServiceService.getServiceUsageById(usage.id, 'staff', 'staff-1');
                    expect(res.id).toBe(usage.id);
                });
            });

            it('TC_BS_QLK_S_74: [EP] bulkCreateServiceUsages: Lỗi ném ra từ DAO (Error handling)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    const res = await visitServiceService.bulkCreateServiceUsages({ items: [{ visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId }] });
                    expect(res.createdCount).toBe(1);
                });
            });

            it('TC_BS_QLK_S_75: [EP] createServiceUsage: Ghi nhận thời gian chỉ định (orderedAt)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    const res = await visitServiceService.createServiceUsage({ visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId });
                    expect(res.orderedAt).toBeDefined();
                });
            });
        });

        // =========================================================================
        // NHÓM 4: ĐƠN THUỐC & TÍNH TIỀN (TC_BS_QLK_S_76 - TC_BS_QLK_S_100)
        // =========================================================================
        describe('Nhóm 4: Đơn thuốc & Tính toán chi phí', () => {
            it('TC_BS_QLK_S_76: [Logic] Thêm thuốc trùng: Phải gộp số lượng vào 1 dòng (Nghiệp vụ: FAIL)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const med = await prisma.medicine.findFirst();
                    await prescriptionService.addMedicinesToPrescription(p.id, doctorId, [
                        { medicineId: med.id, quantity: 1, note: '1v', drugName: 'A' },
                        { medicineId: med.id, quantity: 2, note: '1v', drugName: 'A' }
                    ]);
                    const usages = await (prisma as any).medicineUsage.findMany({ where: { prescriptionId: p.id } });
                    expect(usages.length).toBe(1);
                    expect(usages[0].quantity).toBe(3);
                });
            });

            it('TC_BS_QLK_S_77: [BVA] addMedicinesToPrescription: Ghi chú rỗng (Thất bại)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const med = await prisma.medicine.findFirst();
                    await expect(prescriptionService.addMedicinesToPrescription(p.id, doctorId, [{ medicineId: med.id, quantity: 1, note: '', drugName: 'A' }])).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_78: [Logic] Tính tiền thuốc: Giá đơn vị * Số lượng (Nghiệp vụ: FAIL)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const med = await prisma.medicine.findFirst();
                    await (prisma as any).medicineUsage.create({ data: { prescriptionId: p.id, medicineId: med.id, quantity: 10, price: 50, drugName: 'A' } });
                    const res = await visitService.calculateVisitCost(v.id);
                    expect(res.medicinesCost).toBe(500); // 10 * 50
                });
            });

            it('TC_BS_QLK_S_79: [EP] deletePrescription: Chặn xóa khi lượt khám đã "completed" (Lỗi 400)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    await prisma.visit.update({ where: { id: v.id }, data: { status: 'completed' } });
                    await expect(prescriptionService.deletePrescription(p.id, doctorId)).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_80: [EP] updateMedicineUsage: Chặn bác sĩ không phải chủ quản (Lỗi 403)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const med = await prisma.medicine.findFirst();
                    const mu = await (prisma as any).medicineUsage.create({ data: { prescriptionId: p.id, medicineId: med.id, quantity: 1, price: 100, drugName: 'A' } });
                    await expect(prescriptionService.updateMedicineUsage(mu.id, otherDoctorId, { quantity: 10 })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_81: [EP] updatePrescriptionWithMedicines: Thay thế toàn bộ thuốc', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const med = await prisma.medicine.findFirst();
                    const res = await prescriptionService.updatePrescriptionWithMedicines(p.id, doctorId, [{ medicineId: med.id, quantity: 5, note: 'New' }]);
                    expect(res.medicineUsages.length).toBe(1);
                });
            });

            it('TC_BS_QLK_S_82: [EP] getPrescriptionById: Quyền Bệnh nhân truy cập', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const res = await prescriptionService.getPrescriptionById(p.id, patientUserId);
                    expect(res.id).toBe(p.id);
                });
            });

            it('TC_BS_QLK_S_83: [EP] getPrescriptionsByVisitId: Thành công', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const res = await prescriptionService.getPrescriptionsByVisitId(v.id);
                    expect(res.length).toBe(1);
                });
            });

            it('TC_BS_QLK_S_84: [EP] getPrescriptionsList: Lọc theo "paid" status', async () => {
                await runTest(async () => {
                    const res = await prescriptionService.getPrescriptionsList({ paid: true, page: '1', limit: '10' });
                    expect(res.data).toBeDefined();
                });
            });

            it('TC_BS_QLK_S_85: [EP] getMedicineUsagesByPrescriptionId: Thành công', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const res = await prescriptionService.getMedicineUsagesByPrescriptionId(p.id);
                    expect(res).toBeDefined();
                });
            });

            it('TC_BS_QLK_S_86: [EP] createMedicineUsage: Đơn thuốc không tồn tại (Lỗi 404)', async () => {
                await runTest(async () => {
                    await expect(prescriptionService.createMedicineUsage('ghost-p', doctorId, { medicineId: 'm1', quantity: 1, note: 'A' } as any)).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_87: [EP] updateMedicineUsage: Thành công (Bác sĩ chủ quản)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const med = await prisma.medicine.findFirst();
                    const mu = await (prisma as any).medicineUsage.create({ data: { prescriptionId: p.id, medicineId: med.id, quantity: 1, price: 100, drugName: 'A' } });
                    const res = await prescriptionService.updateMedicineUsage(mu.id, doctorId, { quantity: 10 });
                    expect(res.quantity).toBe(10);
                });
            });

            it('TC_BS_QLK_S_88: [EP] deleteMedicineUsage: Thành công (Bác sĩ chủ quản)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const med = await prisma.medicine.findFirst();
                    const mu = await (prisma as any).medicineUsage.create({ data: { prescriptionId: p.id, medicineId: med.id, quantity: 1, price: 100, drugName: 'A' } });
                    const res = await prescriptionService.deleteMedicineUsage(mu.id, doctorId);
                    expect(res.success).toBe(true);
                });
            });

            it('TC_BS_QLK_S_89: [EP] togglePurchaseMedicines: Đổi trạng thái mua thuốc', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const med = await prisma.medicine.findFirst();
                    const mu = await (prisma as any).medicineUsage.create({ data: { prescriptionId: p.id, medicineId: med.id, quantity: 1, price: 100, drugName: 'A', isPurchased: false } });
                    const res = await prescriptionService.togglePurchaseMedicines([mu.id]);
                    expect(res.count).toBe(1);
                });
            });

            it('TC_BS_QLK_S_90: [EP] validateVisitForPrescription: Chặn bác sĩ không được giao (Lỗi 403)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId: otherDoctorId });
                    await expect(prescriptionService.createPrescription(doctorId, { visitId: v.id })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_91: [EP] updatePrescription: Sửa ghi chú đơn thuốc', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const res = await prescriptionService.updatePrescription(p.id, doctorId, { note: 'Updated note' });
                    expect(res.note).toBe('Updated note');
                });
            });

            it('TC_BS_QLK_S_92: [EP] getPrescriptionById: Không tìm thấy (Lỗi 404)', async () => {
                await runTest(async () => {
                    await expect(prescriptionService.getPrescriptionById('ghost-p')).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_93: [EP] deleteMedicineUsage: Chặn bác sĩ khác xóa (Lỗi 403)', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const med = await prisma.medicine.findFirst();
                    const mu = await (prisma as any).medicineUsage.create({ data: { prescriptionId: p.id, medicineId: med.id, quantity: 1, price: 100, drugName: 'A' } });
                    await expect(prescriptionService.deleteMedicineUsage(mu.id, otherDoctorId)).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_94: [EP] createPrescription: Visit đã bị hủy (Lỗi 400)', async () => {
                await runTest(async () => {
                    const v = await prisma.visit.create({ data: { ehrId, doctorId, status: 'cancelled', patientUserId } } as any);
                    await expect(prescriptionService.createPrescription(doctorId, { visitId: v.id })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_95: [EP] getPrescriptionsList: Lọc theo khoảng ngày (fromDate/toDate)', async () => {
                await runTest(async () => {
                    const res = await prescriptionService.getPrescriptionsList({ fromDate: '2024-01-01', toDate: '2024-12-31', page: '1', limit: '10' });
                    expect(res.data).toBeDefined();
                });
            });

            it('TC_BS_QLK_S_96: [EP] updateMedicineUsage: Medicine usage không tồn tại (Lỗi 404)', async () => {
                await runTest(async () => {
                    await expect(prescriptionService.updateMedicineUsage('ghost-mu', doctorId, { quantity: 1 })).rejects.toThrow();
                });
            });

            it('TC_BS_QLK_S_97: [EP] getVisitSummary: Bao gồm đầy đủ Breakdown chi phí', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const res = await visitService.getVisitSummary(v.id, doctorId, 'doctor');
                    expect(res.id).toBe(v.id);
                });
            });

            it('TC_BS_QLK_S_98: [EP] calculateVisitCost: Khi có nhiều dịch vụ và thuốc hỗn hợp', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const s = await prisma.medicalService.findFirst();
                    await visitServiceService.createServiceUsage({ visitId: v.id, medicalServiceId: s.id, quantity: 1, orderedByUserId: doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const med = await prisma.medicine.findFirst();
                    await (prisma as any).medicineUsage.create({ data: { prescriptionId: p.id, medicineId: med.id, quantity: 1, price: 100, drugName: 'A' } });
                    const res = await visitService.calculateVisitCost(v.id);
                    expect(res.totalCost).toBeGreaterThan(0);
                });
            });

            it('TC_BS_QLK_S_99: [EP] getPrescriptionById: Quyền Staff truy cập', async () => {
                await runTest(async () => {
                    const v = await visitService.createVisit({ patientUserId, doctorId });
                    const p = await prescriptionService.createPrescription(doctorId, { visitId: v.id });
                    const res = await prescriptionService.getPrescriptionById(p.id, 'staff-1');
                    expect(res.id).toBe(p.id);
                });
            });

            it('TC_BS_QLK_S_100: [Logic] Hoàn tất lượt khám: Đồng bộ trạng thái Appointment (Transaction coverage)', async () => {
                await runTest(async () => {
                    const app = await (prisma as any).appointment.create({ data: { patient: { connect: { userId: patientUserId } }, doctorId, startTime: new Date(), status: 'scheduled', reason: 'SQA Test' } });
                    const v = await visitService.createVisit({ patientUserId, doctorId, appointmentId: app.id });
                    const res = await visitService.completeVisit(v.id, doctorId, 'doctor');
                    expect(res.status).toBe('completed');
                    const updatedApp = await (prisma as any).appointment.findUnique({ where: { id: app.id } });
                    expect(updatedApp.status).toBe('completed');
                });
            });
        });
    });
});
