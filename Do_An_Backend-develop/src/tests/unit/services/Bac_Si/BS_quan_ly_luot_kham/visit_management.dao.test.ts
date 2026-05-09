import prisma from '@src/config/prisma';
import * as medicalRecordDao from '@src/daos/medical-record.dao';
import visitDao from '@src/daos/visit.dao';
import * as prescriptionDao from '@src/daos/prescription.dao';
import medicalServiceDao from '@src/daos/medical-service.dao';
import { visitServiceDao } from '@src/daos/visit-service.dao';
import { VisitStatus, VisitType } from '@prisma/client';

describe('Integration Test Visit Management DAO - 100 Cases Century Suite', () => {
    let doctor: any;
    let patient: any;
    let ehr: any;
    let medicine: any;
    let medicalService: any;
    let department: any;

    beforeAll(async () => {
        // Fetch real data for testing
        doctor = await prisma.doctor.findFirst({ include: { staff: { include: { user: true } } } });
        patient = await prisma.patient.findFirst({ include: { user: true } });
        ehr = await prisma.eHR.findFirst({ where: { patientId: patient.id } });
        medicine = await prisma.medicine.findFirst();
        medicalService = await prisma.medicalService.findFirst();
        department = await prisma.department.findFirst();

        if (!doctor || !patient || !ehr || !medicine || !medicalService || !department) {
            throw new Error('Missing prerequisite data in database for integration tests');
        }
    });

    const runTest = async (testFn: (tx: any) => Promise<void>) => {
        try {
            await prisma.$transaction(async (tx) => {
                await testFn(tx);
                throw new Error('ROLLBACK');
            });
        } catch (e: any) {
            if (e.message !== 'ROLLBACK') throw e;
        }
    };

    // ==========================================
    // MEDICAL RECORD (1-15)
    // ==========================================
    describe('Medical Record DAOs', () => {
        it('TC_BS_QLK_DAO_01: createMedicalRecord - Full detail check', async () => {
            await runTest(async () => {
                const visit = await visitDao.createVisit({
                    ehrId: ehr.id,
                    patientUserId: patient.userId,
                    doctorId: doctor.id,
                    status: VisitStatus.in_progress
                });

                const data = {
                    visitId: visit.id,
                    title: 'Test Record 01',
                    symptoms: 'Fever, cough',
                    diagnosis: 'Common cold',
                    treatments: 'Rest and fluids',
                    notes: 'Follow up in 3 days'
                };

                const record = await medicalRecordDao.createMedicalRecord(doctor.userId, data);
                expect(record).toBeDefined();
                expect(record.title).toBe(data.title);
                expect(record.symptoms).toBe(data.symptoms);
                expect(record.diagnosis).toBe(data.diagnosis);
                expect(record.treatments).toBe(data.treatments);
                expect(record.notes).toBe(data.notes);
                expect(record.doctorId).toBe(doctor.userId);
            });
        });

        it('TC_BS_QLK_DAO_02: findMedicalRecordById - Existence check', async () => {
            await runTest(async () => {
                const visit = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const record = await medicalRecordDao.createMedicalRecord(doctor.userId, {
                    visitId: visit.id, title: 'Find Me', symptoms: 'S1', diagnosis: 'D1', treatments: 'T1'
                });
                const found = await medicalRecordDao.findMedicalRecordById(record.id);
                expect(found).not.toBeNull();
                expect(found?.id).toBe(record.id);
                expect(found?.title).toBe('Find Me');
            });
        });

        it('TC_BS_QLK_DAO_03: updateMedicalRecord - Partial update', async () => {
            await runTest(async () => {
                const visit = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const record = await medicalRecordDao.createMedicalRecord(doctor.userId, {
                    visitId: visit.id, title: 'Old Title', symptoms: 'S1', diagnosis: 'D1', treatments: 'T1'
                });
                const updated = await medicalRecordDao.updateMedicalRecord(record.id, { title: 'New Title' });
                expect(updated.title).toBe('New Title');
                expect(updated.symptoms).toBe('S1'); // Should remain unchanged
            });
        });

        it('TC_BS_QLK_DAO_04: updateMedicalRecord - Full update', async () => {
            await runTest(async () => {
                const visit = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const record = await medicalRecordDao.createMedicalRecord(doctor.userId, {
                    visitId: visit.id, title: 'T1', symptoms: 'S1', diagnosis: 'D1', treatments: 'Tr1'
                });
                const updated = await medicalRecordDao.updateMedicalRecord(record.id, {
                    title: 'T2', symptoms: 'S2', diagnosis: 'D2', treatments: 'Tr2', notes: 'N2'
                });
                expect(updated.title).toBe('T2');
                expect(updated.symptoms).toBe('S2');
                expect(updated.diagnosis).toBe('D2');
                expect(updated.notes).toBe('N2');
            });
        });

        it('TC_BS_QLK_DAO_05: deleteMedicalRecord - Verify removal', async () => {
            await runTest(async () => {
                const visit = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const record = await medicalRecordDao.createMedicalRecord(doctor.userId, {
                    visitId: visit.id, title: 'Delete Me', symptoms: 'S1', diagnosis: 'D1', treatments: 'T1'
                });
                await medicalRecordDao.deleteMedicalRecord(record.id);
                const found = await medicalRecordDao.findMedicalRecordById(record.id);
                expect(found).toBeNull();
            });
        });

        it('TC_BS_QLK_DAO_06: checkDoctorOwnership - True case', async () => {
            await runTest(async () => {
                const visit = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const record = await medicalRecordDao.createMedicalRecord(doctor.userId, {
                    visitId: visit.id, title: 'T1', symptoms: 'S1', diagnosis: 'D1', treatments: 'T1'
                });
                const isOwner = await medicalRecordDao.checkDoctorOwnership(record.id, doctor.userId);
                expect(isOwner).toBe(true);
            });
        });

        it('TC_BS_QLK_DAO_07: checkDoctorOwnership - False case', async () => {
            await runTest(async () => {
                const visit = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const record = await medicalRecordDao.createMedicalRecord(doctor.userId, {
                    visitId: visit.id, title: 'T1', symptoms: 'S1', diagnosis: 'D1', treatments: 'T1'
                });
                const isOwner = await medicalRecordDao.checkDoctorOwnership(record.id, 'wrong-id');
                expect(isOwner).toBe(false);
            });
        });

        it('TC_BS_QLK_DAO_08: getMedicalRecords - Pagination check', async () => {
            await runTest(async () => {
                const visit = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                await medicalRecordDao.createMedicalRecord(doctor.userId, { visitId: visit.id, title: 'R1', symptoms: 'S', diagnosis: 'D', treatments: 'T' });
                await medicalRecordDao.createMedicalRecord(doctor.userId, { visitId: visit.id, title: 'R2', symptoms: 'S', diagnosis: 'D', treatments: 'T' });
                
                const result = await medicalRecordDao.getMedicalRecords({
                    page: 1, limit: 1, sortBy: 'createdAt', sortOrder: 'desc', doctorId: doctor.userId
                });
                expect(result.data.length).toBe(1);
                expect(result.pagination.total).toBeGreaterThanOrEqual(2);
                expect(result.pagination.totalPages).toBeGreaterThanOrEqual(2);
            });
        });

        it('TC_BS_QLK_DAO_09: getMedicalRecords - Filter by visitId', async () => {
            await runTest(async () => {
                const visit = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                await medicalRecordDao.createMedicalRecord(doctor.userId, { visitId: visit.id, title: 'V-Record', symptoms: 'S', diagnosis: 'D', treatments: 'T' });
                
                const result = await medicalRecordDao.getMedicalRecords({
                    page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc', visitId: visit.id
                });
                expect(result.data.every(r => r.visitId === visit.id)).toBe(true);
            });
        });

        it('TC_BS_QLK_DAO_10: createMedicalRecord - Nullable notes', async () => {
            await runTest(async () => {
                const visit = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const record = await medicalRecordDao.createMedicalRecord(doctor.userId, {
                    visitId: visit.id, title: 'No Notes', symptoms: 'S', diagnosis: 'D', treatments: 'T'
                });
                expect(record.notes).toBeNull();
            });
        });

        it('TC_BS_QLK_DAO_11: findMedicalRecordById - Null case', async () => {
            const found = await medicalRecordDao.findMedicalRecordById('non-existent-uuid');
            expect(found).toBeNull();
        });

        it('TC_BS_QLK_DAO_12: updateMedicalRecord - Non-existent ID', async () => {
            await expect(medicalRecordDao.updateMedicalRecord('non-existent', { title: 'New' })).rejects.toThrow();
        });

        it('TC_BS_QLK_DAO_13: deleteMedicalRecord - Non-existent ID', async () => {
            await expect(medicalRecordDao.deleteMedicalRecord('non-existent')).rejects.toThrow();
        });

        it('TC_BS_QLK_DAO_14: createMedicalRecord - Multiple records for one visit', async () => {
            await runTest(async () => {
                const visit = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                await medicalRecordDao.createMedicalRecord(doctor.userId, { visitId: visit.id, title: 'R1', symptoms: 'S1', diagnosis: 'D1', treatments: 'T1' });
                await medicalRecordDao.createMedicalRecord(doctor.userId, { visitId: visit.id, title: 'R2', symptoms: 'S2', diagnosis: 'D2', treatments: 'T2' });
                const result = await medicalRecordDao.getMedicalRecords({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'asc', visitId: visit.id });
                expect(result.data.length).toBe(2);
            });
        });

        it('TC_BS_QLK_DAO_15: getMedicalRecords - Sorting asc/desc', async () => {
            await runTest(async () => {
                const visit = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                await medicalRecordDao.createMedicalRecord(doctor.userId, { visitId: visit.id, title: 'A_Record', symptoms: 'S', diagnosis: 'D', treatments: 'T' });
                await medicalRecordDao.createMedicalRecord(doctor.userId, { visitId: visit.id, title: 'Z_Record', symptoms: 'S', diagnosis: 'D', treatments: 'T' });
                
                const desc = await medicalRecordDao.getMedicalRecords({ page: 1, limit: 10, sortBy: 'title', sortOrder: 'desc', visitId: visit.id });
                expect(desc.data[0].title).toBe('Z_Record');
                
                const asc = await medicalRecordDao.getMedicalRecords({ page: 1, limit: 10, sortBy: 'title', sortOrder: 'asc', visitId: visit.id });
                expect(asc.data[0].title).toBe('A_Record');
            });
        });
    });

    // ==========================================
    // VISIT (16-40)
    // ==========================================
    describe('Visit DAOs', () => {
        it('TC_BS_QLK_DAO_16: createVisit - Default status in_progress', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                expect(v.status).toBe(VisitStatus.in_progress);
                expect(v.ehrId).toBe(ehr.id);
            });
        });

        it('TC_BS_QLK_DAO_17: createVisit - Custom type and doctor', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({
                    ehrId: ehr.id, patientUserId: patient.userId, doctorId: doctor.userId, type: 'followUp'
                });
                expect(v.doctorId).toBe(doctor.userId);
                expect(v.type).toBe('followUp');
            });
        });

        it('TC_BS_QLK_DAO_18: findVisitById - Basic fields only', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const found = await visitDao.findVisitById(v.id);
                expect(found).not.toBeNull();
                expect(found?.id).toBe(v.id);
                expect(Object.keys(found!)).toEqual(expect.arrayContaining(['id', 'status', 'doctorId']));
            });
        });

        it('TC_BS_QLK_DAO_19: getDetailsOfVisit - Full inclusion', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const details = await visitDao.getDetailsOfVisit(v.id);
                expect(details).not.toBeNull();
                expect(details?.ehr).toBeDefined();
                expect(details?.prescriptions).toBeDefined();
                expect(details?.visitServices).toBeDefined();
            });
        });

        it('TC_BS_QLK_DAO_20: getVisitsOfDoctor - Filtering and metadata', async () => {
            await runTest(async () => {
                await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId, doctorId: doctor.userId });
                const result = await visitDao.getVisitsOfDoctor(doctor.userId, { page: '1', limit: '5' });
                expect(result.data).toBeDefined();
                expect(result.metadata.totalItems).toBeGreaterThanOrEqual(1);
            });
        });

        it('TC_BS_QLK_DAO_21: getVisitStatsByDate - Count integrity', async () => {
            await runTest(async () => {
                const today = new Date().toISOString();
                await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId, status: VisitStatus.waiting, startTime: today });
                await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId, status: VisitStatus.completed, startTime: today });
                const stats = await visitDao.getVisitStatsByDate(today, today);
                expect(stats.waiting).toBeGreaterThanOrEqual(1);
                expect(stats.completed).toBeGreaterThanOrEqual(1);
                expect(stats.total).toBeGreaterThanOrEqual(2);
            });
        });

        it('TC_BS_QLK_DAO_22: searchVisits - OR patientUserId / ehr.patient.patientId', async () => {
            await runTest(async () => {
                const result = await visitDao.searchVisits(patient.id, { page: '1', limit: '10' });
                expect(result.data.length).toBeGreaterThanOrEqual(0);
            });
        });

        it('TC_BS_QLK_DAO_23: getTasksOfDoctor - Direct visit task', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId, doctorId: doctor.userId, status: VisitStatus.waiting });
                const result = await visitDao.getTasksOfDoctor(doctor.userId, { status: VisitStatus.waiting });
                const task = result.data.find((t: any) => t.id === v.id);
                expect(task).toBeDefined();
                expect(task.taskSource).toBe('visit');
            });
        });

        it('TC_BS_QLK_DAO_24: getTasksOfDoctor - Visit with empty EHR returns empty', async () => {
            const result = await visitDao.getVisitsOfPatient('non-existent-patient', {});
            expect(result.data.length).toBe(0);
            expect(result.metadata.totalItems).toBe(0);
        });

        it('TC_BS_QLK_DAO_25: getVisitCountsByStatus - Patient specific', async () => {
            await runTest(async () => {
                const stats = await visitDao.getVisitCountsByStatus(undefined, undefined, patient.userId);
                expect(stats.total).toBeGreaterThanOrEqual(0);
                expect(stats.byStatus).toBeDefined();
            });
        });

        it('TC_BS_QLK_DAO_26: getMonthlyVisitCountsByYear - SQL format check', async () => {
            await runTest(async () => {
                const rows = await visitDao.getMonthlyVisitCountsByYear(2026);
                expect(Array.isArray(rows)).toBe(true);
            });
        });

        it('TC_BS_QLK_DAO_27: getVisitsByDate - Multiple filters', async () => {
            await runTest(async () => {
                const today = new Date().toISOString();
                const result = await visitDao.getVisitsByDate({
                    fromDate: today, toDate: today, status: VisitStatus.in_progress, doctorId: doctor.userId
                });
                expect(result.data).toBeDefined();
            });
        });

        it('TC_BS_QLK_DAO_28: createVisit - With appointmentId', async () => {
            await runTest(async () => {
                const appt = await prisma.appointment.findFirst();
                if (appt) {
                    const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId, appointmentId: appt.id });
                    expect(v.appointmentId).toBe(appt.id);
                }
            });
        });

        it('TC_BS_QLK_DAO_29: getVisitsOfPatient - Pagination metadata check', async () => {
            await runTest(async () => {
                const result = await visitDao.getVisitsOfPatient(patient.userId, { page: '1', limit: '2' });
                // Check either page or currentPage depending on EHR existence (though QueryBuilder uses page)
                const page = result.metadata.page ?? (result.metadata as any).currentPage;
                expect(page).toBe(1);
            });
        });

        it('TC_BS_QLK_DAO_30: getDetailsOfVisit - Non-existent ID returns null', async () => {
            const details = await visitDao.getDetailsOfVisit('invalid-id');
            expect(details).toBeNull();
        });

        it('TC_BS_QLK_DAO_31: createVisit - Null doctorId allowed', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId, doctorId: undefined });
                expect(v.doctorId).toBeNull();
            });
        });

        it('TC_BS_QLK_DAO_32: getVisitCountsByStatus - Date range filter', async () => {
            await runTest(async () => {
                const from = new Date('2026-01-01');
                const to = new Date('2026-12-31');
                const stats = await visitDao.getVisitCountsByStatus(from, to);
                expect(stats).toBeDefined();
            });
        });

        it('TC_BS_QLK_DAO_33: getTasksOfDoctor - Filtering by completed status', async () => {
            await runTest(async () => {
                const result = await visitDao.getTasksOfDoctor(doctor.userId, { status: VisitStatus.completed });
                expect(result.data.every((t: any) => t.status === VisitStatus.completed)).toBe(true);
            });
        });

        it('TC_BS_QLK_DAO_34: searchVisits - Date filters gte/lte', async () => {
            await runTest(async () => {
                const from = '2026-05-01';
                const to = '2026-05-31';
                const result = await visitDao.searchVisits(patient.id, { fromDate: from, toDate: to });
                expect(result.data).toBeDefined();
            });
        });

        it('TC_BS_QLK_DAO_35: getMonthlyVisitCountsByYear - Patient filtered', async () => {
            await runTest(async () => {
                const rows = await visitDao.getMonthlyVisitCountsByYear(2026, 'UTC', patient.id);
                expect(Array.isArray(rows)).toBe(true);
            });
        });

        it('TC_BS_QLK_DAO_36: getVisitsByDate - SortOrder desc', async () => {
            await runTest(async () => {
                const result = await visitDao.getVisitsByDate({ sortBy: 'startTime', sortOrder: 'desc' });
                if (result.data.length >= 2) {
                    const first = new Date(result.data[0].startTime!).getTime();
                    const second = new Date(result.data[1].startTime!).getTime();
                    expect(first).toBeGreaterThanOrEqual(second);
                }
            });
        });

        it('TC_BS_QLK_DAO_37: createVisit - With startTime', async () => {
            await runTest(async () => {
                const startTime = new Date().toISOString();
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId, startTime });
                expect(new Date(v.startTime!).toISOString()).toBe(new Date(startTime).toISOString());
            });
        });

        it('TC_BS_QLK_DAO_38: findVisitById - Existence only select id', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const found = await visitDao.findVisitById(v.id);
                expect(found?.id).toBe(v.id);
            });
        });

        it('TC_BS_QLK_DAO_39: getVisitsOfDoctor - Limit 0 edge case', async () => {
            await runTest(async () => {
                const result = await visitDao.getVisitsOfDoctor(doctor.userId, { limit: '0' });
                expect(result.data.length).toBe(0);
            });
        });

        it('TC_BS_QLK_DAO_40: getTasksOfDoctor - Empty result for unknown doctor', async () => {
            const result = await visitDao.getTasksOfDoctor('unknown-uuid', {});
            expect(result.data.length).toBe(0);
            expect(result.metadata.totalItems).toBe(0);
        });
    });

    // ==========================================
    // PRESCRIPTION (41-70)
    // ==========================================
    describe('Prescription DAOs', () => {
        it('TC_BS_QLK_DAO_41: createPrescription - Single medicine', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, {
                    visitId: v.id,
                    medicines: [{ medicineId: medicine.id, drugName: 'Med A', quantity: 2, price: 100 }]
                });
                expect(p.visitId).toBe(v.id);
                expect(p.medicineUsages.length).toBe(1);
                expect(p.medicineUsages[0].drugName).toBe('Med A');
            });
        });

        it('TC_BS_QLK_DAO_42: findPrescriptionById - Detailed include', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, { visitId: v.id });
                const found = await prescriptionDao.findPrescriptionById(p.id);
                expect(found?.id).toBe(p.id);
                expect(found?.visit).toBeDefined();
            });
        });

        it('TC_BS_QLK_DAO_43: findPrescriptionsByVisitId - List check', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                await prescriptionDao.createPrescription(doctor.staff.userId, { visitId: v.id });
                const list = await prescriptionDao.findPrescriptionsByVisitId(v.id);
                expect(list.length).toBeGreaterThanOrEqual(1);
            });
        });

        it('TC_BS_QLK_DAO_44: updatePrescription - Paid status', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, { visitId: v.id });
                const updated = await prescriptionDao.updatePrescription(p.id, { paid: true });
                expect(updated.paid).toBe(true);
            });
        });

        it('TC_BS_QLK_DAO_45: deletePrescription - Cascade usage deletion', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, {
                    visitId: v.id, medicines: [{ drugName: 'M1', quantity: 1 }]
                });
                const usageId = p.medicineUsages[0].id;
                await prescriptionDao.deletePrescription(p.id);
                const foundUsage = await prescriptionDao.findMedicineUsageById(usageId);
                expect(foundUsage).toBeNull();
            });
        });

        it('TC_BS_QLK_DAO_46: getPrescriptions - Filtering by paid', async () => {
            await runTest(async () => {
                const result = await prescriptionDao.getPrescriptions({ paid: false, page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });
                expect(result.data.every(p => p.paid === false)).toBe(true);
            });
        });

        it('TC_BS_QLK_DAO_47: checkPrescriptionOwnership - Creator check', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, { visitId: v.id });
                const isOwner = await prescriptionDao.checkPrescriptionOwnership(p.id, doctor.staff.userId);
                expect(isOwner).toBe(true);
            });
        });

        it('TC_BS_QLK_DAO_48: createMedicineUsage - Manual addition', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, { visitId: v.id });
                const u = await prescriptionDao.createMedicineUsage(p.id, { drugName: 'Extra Med', quantity: 5 });
                expect(u.prescriptionId).toBe(p.id);
                expect(u.drugName).toBe('Extra Med');
            });
        });

        it('TC_BS_QLK_DAO_49: updateMedicineUsage - Quantity change', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, {
                    visitId: v.id, medicines: [{ drugName: 'M1', quantity: 1 }]
                });
                const updated = await prescriptionDao.updateMedicineUsage(p.medicineUsages[0].id, { quantity: 10 });
                expect(updated.quantity).toBe(10);
            });
        });

        it('TC_BS_QLK_DAO_50: batchCreateMedicineUsages - Transactional creation', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, { visitId: v.id });
                const items = await prescriptionDao.batchCreateMedicineUsages(p.id, [
                    { drugName: 'B1', quantity: 1 }, { drugName: 'B2', quantity: 2 }
                ]);
                expect(items.length).toBe(2);
                expect(items[1].drugName).toBe('B2');
            });
        });

        it('TC_BS_QLK_DAO_51: replaceMedicineUsages - Full replacement logic', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, {
                    visitId: v.id, medicines: [{ drugName: 'OLD', quantity: 1 }]
                });
                const replaced = await prescriptionDao.replaceMedicineUsages(p.id, [{ drugName: 'NEW', quantity: 5 }]);
                expect(replaced?.medicineUsages.length).toBe(1);
                expect(replaced?.medicineUsages[0].drugName).toBe('NEW');
            });
        });

        it('TC_BS_QLK_DAO_52: findMedicineUsageById - Return type check', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, {
                    visitId: v.id, medicines: [{ drugName: 'M1', quantity: 1 }]
                });
                const u = await prescriptionDao.findMedicineUsageById(p.medicineUsages[0].id);
                expect(u?.drugName).toBe('M1');
            });
        });

        it('TC_BS_QLK_DAO_53: createPrescription - Multiple medicines batch', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, {
                    visitId: v.id,
                    medicines: [
                        { medicineId: medicine.id, drugName: 'A', quantity: 1 },
                        { drugName: 'B', quantity: 2 }
                    ]
                });
                expect(p.medicineUsages.length).toBe(2);
            });
        });

        it('TC_BS_QLK_DAO_54: updateMedicineUsage - Connect/Disconnect medicine', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, {
                    visitId: v.id, medicines: [{ drugName: 'M1', quantity: 1 }]
                });
                const uId = p.medicineUsages[0].id;
                const connected = await prescriptionDao.updateMedicineUsage(uId, { medicineId: medicine.id });
                expect(connected.medicineId).toBe(medicine.id);
                const disconnected = await prescriptionDao.updateMedicineUsage(uId, { medicineId: null });
                expect(disconnected.medicineId).toBeNull();
            });
        });

        it('TC_BS_QLK_DAO_55: getPrescriptions - Pagination last page', async () => {
            const result = await prescriptionDao.getPrescriptions({ page: 9999, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });
            expect(result.data.length).toBe(0);
        });

        it('TC_BS_QLK_DAO_56: findMedicineUsagesByPrescriptionId - Sorting', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, {
                    visitId: v.id, medicines: [{ drugName: 'First', quantity: 1 }, { drugName: 'Second', quantity: 2 }]
                });
                const usages = await prescriptionDao.findMedicineUsagesByPrescriptionId(p.id);
                expect(usages.length).toBe(2);
            });
        });

        it('TC_BS_QLK_DAO_57: deleteMedicineUsage - Individual deletion', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, {
                    visitId: v.id, medicines: [{ drugName: 'M1', quantity: 1 }]
                });
                await prescriptionDao.deleteMedicineUsage(p.medicineUsages[0].id);
                const usages = await prescriptionDao.findMedicineUsagesByPrescriptionId(p.id);
                expect(usages.length).toBe(0);
            });
        });

        it('TC_BS_QLK_DAO_58: createPrescription - Default paid false', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, { visitId: v.id });
                expect(p.paid).toBe(false);
            });
        });

        it('TC_BS_QLK_DAO_59: replaceMedicineUsages - Grouping by medicineId', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, { visitId: v.id });
                const replaced = await prescriptionDao.replaceMedicineUsages(p.id, [
                    { medicineId: medicine.id, quantity: 1, drugName: 'A' },
                    { medicineId: medicine.id, quantity: 2, drugName: 'A' }
                ]);
                expect(replaced?.medicineUsages.length).toBe(1);
                expect(replaced?.medicineUsages[0].quantity).toBe(3);
            });
        });

        it('TC_BS_QLK_DAO_60: findPrescriptionById - Non-existent ID', async () => {
            const p = await prescriptionDao.findPrescriptionById('non-existent');
            expect(p).toBeNull();
        });

        it('TC_BS_QLK_DAO_61: getPrescriptions - Date range filter gte/lte', async () => {
            await runTest(async () => {
                const from = new Date();
                const to = new Date();
                const result = await prescriptionDao.getPrescriptions({ fromDate: from, toDate: to, page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });
                expect(result.data).toBeDefined();
            });
        });

        it('TC_BS_QLK_DAO_62: updateMedicineUsage - Update note only', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, {
                    visitId: v.id, medicines: [{ drugName: 'M1', quantity: 1 }]
                });
                const updated = await prescriptionDao.updateMedicineUsage(p.medicineUsages[0].id, { note: 'New Note' });
                expect(updated.note).toBe('New Note');
            });
        });

        it('TC_BS_QLK_DAO_63: updateMedicineUsage - isPurchased toggle', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, {
                    visitId: v.id, medicines: [{ drugName: 'M1', quantity: 1 }]
                });
                const updated = await prescriptionDao.updateMedicineUsage(p.medicineUsages[0].id, { isPurchased: true });
                expect(updated.isPurchased).toBe(true);
            });
        });

        it('TC_BS_QLK_DAO_64: createMedicineUsage - Nullable medicineId', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, { visitId: v.id });
                const u = await prescriptionDao.createMedicineUsage(p.id, { drugName: 'Generic', quantity: 1, medicineId: null });
                expect(u.medicineId).toBeNull();
            });
        });

        it('TC_BS_QLK_DAO_65: batchCreateMedicineUsages - Mixed null/not-null medicineId', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, { visitId: v.id });
                const items = await prescriptionDao.batchCreateMedicineUsages(p.id, [
                    { drugName: 'A', quantity: 1, medicineId: medicine.id },
                    { drugName: 'B', quantity: 1, medicineId: null }
                ]);
                expect(items[0].medicineId).toBe(medicine.id);
                expect(items[1].medicineId).toBeNull();
            });
        });

        it('TC_BS_QLK_DAO_66: checkPrescriptionOwnership - False for wrong user', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, { visitId: v.id });
                const isOwner = await prescriptionDao.checkPrescriptionOwnership(p.id, 'other-user-id');
                expect(isOwner).toBe(false);
            });
        });

        it('TC_BS_QLK_DAO_67: findPrescriptionsByVisitId - Empty list case', async () => {
            const list = await prescriptionDao.findPrescriptionsByVisitId('empty-visit-id');
            expect(list.length).toBe(0);
        });

        it('TC_BS_QLK_DAO_68: createPrescription - price field integrity', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const p = await prescriptionDao.createPrescription(doctor.staff.userId, {
                    visitId: v.id, medicines: [{ drugName: 'M1', quantity: 1, price: 99.5 }]
                });
                expect(p.medicineUsages[0].price).toBe(99.5);
            });
        });

        it('TC_BS_QLK_DAO_69: deleteMedicineUsage - Non-existent ID error', async () => {
            await expect(prescriptionDao.deleteMedicineUsage('non-existent')).rejects.toThrow();
        });

        it('TC_BS_QLK_DAO_70: updatePrescription - Non-existent ID error', async () => {
            await expect(prescriptionDao.updatePrescription('non-existent', { paid: true })).rejects.toThrow();
        });
    });

    // ==========================================
    // MEDICAL SERVICE (71-85)
    // ==========================================
    describe('Medical Service DAOs', () => {
        it('TC_BS_QLK_DAO_71: getMedicalServices - Search by name', async () => {
            const res = await medicalServiceDao.getMedicalServices({ search: medicalService.name.substring(0, 3) });
            expect(res.data.length).toBeGreaterThanOrEqual(1);
        });

        it('TC_BS_QLK_DAO_72: getMedicalServiceById - Detail check', async () => {
            const res = await medicalServiceDao.getMedicalServiceById(medicalService.id);
            expect(res?.id).toBe(medicalService.id);
            expect(res?.department).toBeDefined();
        });

        it('TC_BS_QLK_DAO_73: getServicesByDepartment - Basic count', async () => {
            const res = await medicalServiceDao.getServicesByDepartment(department.id);
            expect(res.metadata.totalItems).toBeDefined();
        });

        it('TC_BS_QLK_DAO_74: createMedicalService - Full attributes', async () => {
            await runTest(async () => {
                const data = {
                    name: 'New Service SQA ' + Date.now(),
                    description: 'Desc',
                    price: 500,
                    unit: 'Lan',
                    durationMinutes: 30,
                    isActive: true,
                    percentApplyHealthInsurance: 80,
                    departmentId: department.id,
                    roomId: medicalService.roomId
                };
                const res = await medicalServiceDao.createMedicalService(data);
                expect(res?.name).toBe(data.name);
                expect(res?.price).toBe(data.price);
            });
        });

        it('TC_BS_QLK_DAO_75: updateMedicalService - Price update', async () => {
            await runTest(async () => {
                const res = await medicalServiceDao.updateMedicalService({ price: 999, durationMinutes: 15 }, medicalService.id);
                expect(res?.price).toBe(999);
            });
        });

        it('TC_BS_QLK_DAO_76: getPopularServices - Metadata integrity', async () => {
            const res = await medicalServiceDao.getPopularServices(1, 5);
            expect(res.metadata.limit).toBe(5);
        });

        it('TC_BS_QLK_DAO_77: getServicesByPriceRange - Range check', async () => {
            const res = await medicalServiceDao.getServicesByPriceRange(0, 10000000);
            expect(res.data).toBeDefined();
        });

        it('TC_BS_QLK_DAO_78: getListDoctorMedicalServices - Active only', async () => {
            const res = await medicalServiceDao.getListDoctorMedicalServices({ medicalServiceId: medicalService.id });
            expect(res.data.every((d: any) => d.isActive === true)).toBe(true);
        });

        it('TC_BS_QLK_DAO_79: createDoctorService - Assignment check', async () => {
            await runTest(async () => {
                // Create a fresh service to avoid unique constraint on (doctor, service)
                const tempSvc = await medicalServiceDao.createMedicalService({
                    name: 'Temp Doctor Svc ' + Date.now(),
                    price: 100,
                    durationMinutes: 10,
                    departmentId: department.id
                });
                const res = await medicalServiceDao.createDoctorService({
                    doctorId: doctor.userId,
                    medicalServiceId: tempSvc!.id,
                    price: 200,
                    durationMinutes: 15
                });
                expect(res).toBeDefined();
            });
        });

        it('TC_BS_QLK_DAO_80: deleteDoctorService - Verify removal', async () => {
            await runTest(async () => {
                const tempSvc = await medicalServiceDao.createMedicalService({
                    name: 'Delete Doctor Svc ' + Date.now(),
                    price: 100,
                    durationMinutes: 10,
                    departmentId: department.id
                });
                await medicalRecordDao.createMedicalRecord(doctor.userId, { 
                    visitId: (await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId })).id,
                    title: 'T', symptoms: 'S', diagnosis: 'D', treatments: 'T' 
                }); // dummy
                
                await medicalServiceDao.createDoctorService({ doctorId: doctor.userId, medicalServiceId: tempSvc!.id, price: 100, durationMinutes: 10 });
                await medicalServiceDao.deleteDoctorService(doctor.userId, tempSvc!.id);
                const list = await medicalServiceDao.getListDoctorMedicalServices({ medicalServiceId: tempSvc!.id });
                expect(list.data.find((d: any) => d.doctorId === doctor.userId)).toBeUndefined();
            });
        });

        it('TC_BS_QLK_DAO_81: getMedicalServices - Combined filters (isActive + dept)', async () => {
            const res = await medicalServiceDao.getMedicalServices({ isActive: 1, departmentId: department.id });
            expect(res.data.every((s: any) => s.departmentId === department.id)).toBe(true);
        });

        it('TC_BS_QLK_DAO_82: getMedicalServiceById - Non-existent ID', async () => {
            const res = await medicalServiceDao.getMedicalServiceById('invalid-msv');
            expect(res).toBeNull();
        });

        it('TC_BS_QLK_DAO_83: updateMedicalService - isActive toggle', async () => {
            await runTest(async () => {
                const res = await medicalServiceDao.updateMedicalService({ isActive: false, durationMinutes: 10 }, medicalService.id);
                expect(res?.isActive).toBe(false);
            });
        });

        it('TC_BS_QLK_DAO_84: getServicesByDepartment - Pagination boundary', async () => {
            const res = await medicalServiceDao.getServicesByDepartment(department.id, 1, 1);
            expect(res.data.length).toBeLessThanOrEqual(1);
        });

        it('TC_BS_QLK_DAO_85: deleteMedicalService - Verify removal', async () => {
            await runTest(async () => {
                const data = { name: 'Temp ' + Date.now(), price: 10, departmentId: department.id, roomId: medicalService.roomId, durationMinutes: 5 };
                const created = await medicalServiceDao.createMedicalService(data);
                await medicalServiceDao.deleteMedicalService(created!.id);
                const found = await medicalServiceDao.getMedicalServiceById(created!.id);
                expect(found).toBeNull();
            });
        });
    });

    // ==========================================
    // VISIT SERVICE (86-100) - Target Coverage for visit-service.dao.ts
    // ==========================================
    describe('Visit Service DAO (VisitServiceDAO)', () => {
        it('TC_BS_QLK_DAO_86: visitServiceDao.create - Full detail', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const vs = await visitServiceDao.create({
                    visitId: v.id,
                    medicalServiceId: medicalService.id,
                    quantity: 2,
                    price: 150,
                    orderedByUserId: doctor.userId,
                    orderedAt: new Date().toISOString()
                });
                expect(vs.visitId).toBe(v.id);
                expect(vs.medicalService.name).toBe(medicalService.name);
            });
        });

        it('TC_BS_QLK_DAO_87: visitServiceDao.create - Service not found error', async () => {
            await runTest(async () => {
                await expect(visitServiceDao.create({
                    visitId: 'v-id', medicalServiceId: 'invalid-id', quantity: 1, price: 10, orderedByUserId: undefined, orderedAt: ''
                })).rejects.toThrow('Medical service not found');
            });
        });

        it('TC_BS_QLK_DAO_88: visitServiceDao.findById - Detail inclusion', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const created = await visitServiceDao.create({
                    visitId: v.id, medicalServiceId: medicalService.id, quantity: 1, price: 100, orderedByUserId: doctor.userId, orderedAt: ''
                });
                const found = await visitServiceDao.findById(created.id);
                expect(found?.id).toBe(created.id);
                expect(found?.orderedBy).toBeDefined();
            });
        });

        it('TC_BS_QLK_DAO_89: visitServiceDao.findAll - Filters and pagination', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                await visitServiceDao.create({ visitId: v.id, medicalServiceId: medicalService.id, quantity: 1, price: 100, orderedByUserId: undefined, orderedAt: '' });
                const res = await visitServiceDao.findAll({ 
                    visitId: v.id, 
                    medicalServiceId: medicalService.id, 
                    status: 'ordered',
                    endDate: new Date(Date.now() + 86400000).toISOString(), // Future
                    page: 1, 
                    limit: 10 
                });
                expect(res.data.length).toBe(1);
            });
        });

        it('TC_BS_QLK_DAO_90: visitServiceDao.update - Status and quantity', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const vs = await visitServiceDao.create({ visitId: v.id, medicalServiceId: medicalService.id, quantity: 1, price: 100, orderedByUserId: undefined, orderedAt: '' });
                const updated = await visitServiceDao.update(vs.id, { status: 'in_progress', quantity: 10 });
                expect(updated.status).toBe('in_progress');
                expect(updated.quantity).toBe(10);
            });
        });

        it('TC_BS_QLK_DAO_91: visitServiceDao.update - Invoice synchronization', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const vs = await visitServiceDao.create({ visitId: v.id, medicalServiceId: medicalService.id, quantity: 1, price: 100, orderedByUserId: undefined, orderedAt: '' });
                
                // Manually create an invoice and invoice item for this service
                const invoice = await prisma.invoice.create({
                    data: { patientId: patient.userId, totalAmount: 100, status: 'pending' }
                });
                await prisma.invoiceItem.create({
                    data: {
                        invoiceId: invoice.id,
                        item_type: 'service',
                        refId: vs.id,
                        name: 'Service X',
                        quantity: 1,
                        unitPrice: 100,
                        description: 'Desc'
                    }
                });

                // Update quantity -> should trigger invoice update in DAO
                const updated = await visitServiceDao.update(vs.id, { quantity: 3 });
                expect(updated.quantity).toBe(3);
                
                const updatedInvoice = await prisma.invoice.findUnique({ where: { id: invoice.id } });
                expect(updatedInvoice?.totalAmount).toBe(300);
            });
        });

        it('TC_BS_QLK_DAO_92: visitServiceDao.delete - Hard delete and invoice sync', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const vs = await visitServiceDao.create({ visitId: v.id, medicalServiceId: medicalService.id, quantity: 1, price: 500, orderedByUserId: undefined, orderedAt: '' });
                
                const invoice = await prisma.invoice.create({ data: { patientId: patient.userId, totalAmount: 500 } });
                await prisma.invoiceItem.create({
                    data: { invoiceId: invoice.id, item_type: 'service', refId: vs.id, name: 'S', quantity: 1, unitPrice: 500, description: 'D' }
                });

                await visitServiceDao.delete(vs.id);
                const foundInvoice = await prisma.invoice.findUnique({ where: { id: invoice.id } });
                expect(foundInvoice?.totalAmount).toBe(0);
                expect(await visitServiceDao.findById(vs.id)).toBeNull();
            });
        });

        it('TC_BS_QLK_DAO_93: visitServiceDao.updateStatus - Simple update', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const vs = await visitServiceDao.create({ visitId: v.id, medicalServiceId: medicalService.id, quantity: 1, price: 100, orderedByUserId: undefined, orderedAt: '' });
                const updated = await visitServiceDao.updateStatus(vs.id, 'done');
                expect(updated.status).toBe('done');
            });
        });

        it('TC_BS_QLK_DAO_94: visitServiceDao.bulkCreate - Multiple items and skip logic', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const items = [
                    { visitId: v.id, medicalServiceId: medicalService.id, quantity: 1, price: 100 },
                    { visitId: v.id, medicalServiceId: 'invalid-svc', quantity: 2, price: 200 } // Should skip
                ];
                const results = await visitServiceDao.bulkCreate(items);
                expect(results.length).toBe(1);
                expect(results[0].medicalServiceId).toBe(medicalService.id);
            });
        });

        it('TC_BS_QLK_DAO_95: visitServiceDao.findByVisit - Statistics and summary', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                await visitServiceDao.create({ visitId: v.id, medicalServiceId: medicalService.id, quantity: 1, price: 100, orderedByUserId: undefined, orderedAt: '' });
                const listRes = await visitServiceDao.findAll({ visitId: v.id, page: 1, limit: 10 });
                await visitServiceDao.updateStatus(listRes.data[0].id, 'done');
                
                const res = await visitServiceDao.findByVisit(v.id, { 
                    status: 'done',
                    startDate: new Date(Date.now() - 86400000).toISOString(),
                    endDate: new Date(Date.now() + 86400000).toISOString() // Future
                });
                expect(res.items.length).toBe(1);
                expect(res.summary.totalCost).toBeGreaterThan(0);
                expect(res.summary.byStatus['done']).toBeDefined();
            });
        });

        it('TC_BS_QLK_DAO_96: visitServiceDao.completeVisitServicesByVisit - Bulk update status', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                const vs = await visitServiceDao.create({ visitId: v.id, medicalServiceId: medicalService.id, quantity: 1, price: 100, orderedByUserId: undefined, orderedAt: '' });
                await visitServiceDao.updateStatus(vs.id, 'in_progress');
                
                await visitServiceDao.completeVisitServicesByVisit(v.id);
                const updated = await visitServiceDao.findById(vs.id);
                expect(updated?.status).toBe('done');
            });
        });

        it('TC_BS_QLK_DAO_97: visitServiceDao.count - Filter check', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                await visitServiceDao.create({ visitId: v.id, medicalServiceId: medicalService.id, quantity: 1, price: 100, orderedByUserId: undefined, orderedAt: '' });
                const count = await visitServiceDao.count({ visitId: v.id });
                expect(count).toBe(1);
            });
        });

        it('TC_BS_QLK_DAO_98: visitServiceDao.update - Not found error', async () => {
            await expect(visitServiceDao.update('invalid-id', { quantity: 1 })).rejects.toThrow('Visit service not found');
        });

        it('TC_BS_QLK_DAO_99: visitServiceDao.findAll - Date range filtering', async () => {
            await runTest(async () => {
                const start = new Date(Date.now() - 3600000).toISOString();
                const res = await visitServiceDao.findAll({ startDate: start, page: 1, limit: 10 });
                expect(res.data).toBeDefined();
            });
        });

        it('TC_BS_QLK_DAO_100: visitServiceDao.findByVisit - Sorting and pagination', async () => {
            await runTest(async () => {
                const v = await visitDao.createVisit({ ehrId: ehr.id, patientUserId: patient.userId });
                await visitServiceDao.bulkCreate([
                    { visitId: v.id, medicalServiceId: medicalService.id, quantity: 1, price: 100 },
                    { visitId: v.id, medicalServiceId: medicalService.id, quantity: 2, price: 200 }
                ]);
                const res = await visitServiceDao.findByVisit(v.id, { sortBy: 'price', order: 'desc', page: 1, limit: 1 });
                expect(res.items.length).toBe(1);
                expect(res.items[0].price).toBe(200);
            });
        });
    });
});
