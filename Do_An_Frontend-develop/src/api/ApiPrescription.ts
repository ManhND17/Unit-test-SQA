import { IPrescription, IMedicineUsage } from '@src/types';
import { fetcher, fetcherWithMetadata, QueryParam } from './Fetcher';
import { UpdatePurchasedMedicinesBody } from './ApiInvoice';

const path = {
  prescription: '/prescriptions',
  medicineUsage: '/medicine-usages',
};

// ===============================
// PRESCRIPTION TYPES
// ===============================

export type CreatePrescriptionPayload = {
  visitId: string;
  medicines?: CreateMedicineUsagePayload[];
};

export type UpdatePrescriptionPayload = {
  paid?: boolean;
};

type PrescriptionQueryParams = QueryParam & {
  visitId?: string;
  paid?: boolean;
  fromDate?: string;
  toDate?: string;
};

// ===============================
// MEDICINE USAGE TYPES
// ===============================

export type CreateMedicineUsagePayload = {
  medicineId?: string;
  drugName: string;
  quantity: number;
  duration?: string;
  note?: string;
  price?: number;
};

export type UpdateMedicineUsagePayload = Partial<CreateMedicineUsagePayload> & {
  isPurchased?: boolean;
};

// ===============================
// PRESCRIPTION API
// ===============================

const getPrescriptions = async (params: PrescriptionQueryParams) => {
  return fetcherWithMetadata<IPrescription[]>({
    url: path.prescription,
    method: 'GET',
    params,
  });
};

const getPrescriptionById = async (id: string) => {
  return fetcher<IPrescription>({
    url: `${path.prescription}/${id}`,
    method: 'GET',
  });
};

const getPrescriptionsByVisitId = async (visitId: string) => {
  return fetcher<IPrescription[]>({
    url: `${path.prescription}/visit/${visitId}`,
    method: 'GET',
  });
};

const createPrescription = async (payload: CreatePrescriptionPayload) => {
  return fetcher<IPrescription>({
    url: path.prescription,
    method: 'POST',
    data: payload,
  });
};

const updatePrescription = async (
  id: string,
  payload: UpdatePrescriptionPayload
) => {
  return fetcher<IPrescription>({
    url: `${path.prescription}/${id}`,
    method: 'PUT',
    data: payload,
  });
};

const deletePrescription = async (id: string) => {
  return fetcher<void>({
    url: `${path.prescription}/${id}`,
    method: 'DELETE',
  });
};

// ===============================
// MEDICINE USAGE API
// ===============================

const getMedicineUsagesByPrescriptionId = async (prescriptionId: string) => {
  return fetcher<IMedicineUsage[]>({
    url: `${path.medicineUsage}/prescription/${prescriptionId}`,
    method: 'GET',
  });
};

const createMedicineUsage = async (
  prescriptionId: string,
  payload: CreateMedicineUsagePayload
) => {
  return fetcher<IMedicineUsage>({
    url: path.medicineUsage,
    method: 'POST',
    data: {
      prescriptionId,
      ...payload,
    },
  });
};

const updateMedicineUsage = async (
  id: string,
  payload: UpdateMedicineUsagePayload
) => {
  return fetcher<IMedicineUsage>({
    url: `${path.medicineUsage}/${id}`,
    method: 'PUT',
    data: payload,
  });
};

const deleteMedicineUsage = async (id: string) => {
  return fetcher<void>({
    url: `${path.medicineUsage}/${id}`,
    method: 'DELETE',
  });
};

// Batch add medicines to prescription
const addMedicinesToPrescription = async (
  prescriptionId: string,
  medicines: CreateMedicineUsagePayload[]
) => {
  return fetcher<IMedicineUsage[]>({
    url: `${path.medicineUsage}/batch`,
    method: 'POST',
    data: {
      prescriptionId,
      medicines,
    },
  });
};

// Update prescription with new medicines (replace all)
const updatePrescriptionWithMedicines = async (
  prescriptionId: string,
  medicines: CreateMedicineUsagePayload[]
) => {
  return fetcher<IPrescription>({
    url: `${path.prescription}/medicine-usages/batch`,
    method: 'POST',
    data: { medicines, prescriptionId },
  });
};

const togglePurchasedMedicines = async (
  data: UpdatePurchasedMedicinesBody
): Promise<{ success: boolean }> => {
  return fetcher({
    url: `${path.prescription}/medicine-usages/toggle-purchase`,
    method: 'PUT',
    data,
  });
};

export default {
  // Prescription
  getPrescriptions,
  getPrescriptionById,
  getPrescriptionsByVisitId,
  createPrescription,
  updatePrescription,
  deletePrescription,
  // Medicine Usage
  getMedicineUsagesByPrescriptionId,
  createMedicineUsage,
  updateMedicineUsage,
  deleteMedicineUsage,
  addMedicinesToPrescription,
  updatePrescriptionWithMedicines,
  togglePurchasedMedicines,
};
