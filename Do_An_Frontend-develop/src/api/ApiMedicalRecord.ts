import { IMedicalRecord, IVisitService, EVisitServiceStatus } from '@src/types';
import { fetcher, fetcherWithMetadata, QueryParam } from './Fetcher';

const path = {
  medicalRecord: '/medical-records',
  visitService: '/service-usages',
};

// ===============================
// MEDICAL RECORD TYPES
// ===============================

export type CreateMedicalRecordPayload = {
  visitId: string;
  title: string;
  symptoms: string;
  diagnosis: string;
  treatments: string;
  notes?: string;
  fileIds?: string[];
  files?: File[];
};

export type UpdateMedicalRecordPayload = Partial<CreateMedicalRecordPayload>;

type MedicalRecordQueryParams = QueryParam & {
  visitId?: string;
  doctorId?: string;
  fromDate?: string;
  toDate?: string;
};

// ===============================
// VISIT SERVICE TYPES
// ===============================

export type CreateVisitServicePayload = {
  visitId: string;
  medicalServiceId: string;
  quantity?: number;
  status?: EVisitServiceStatus;
};

export type UpdateVisitServicePayload = {
  status?: EVisitServiceStatus;
  quantity?: number;
};

// ===============================
// MEDICAL RECORD API
// ===============================

const getMedicalRecords = async (params: MedicalRecordQueryParams) => {
  return fetcherWithMetadata<IMedicalRecord[]>({
    url: path.medicalRecord,
    method: 'GET',
    params,
  });
};

const getMedicalRecordById = async (id: string) => {
  return fetcher<IMedicalRecord>({
    url: `${path.medicalRecord}/${id}`,
    method: 'GET',
  });
};

const getMedicalRecordsByVisitId = async (visitId: string) => {
  return fetcher<IMedicalRecord[]>({
    url: `${path.medicalRecord}/visit/${visitId}`,
    method: 'GET',
  });
};

const createMedicalRecord = async (payload: CreateMedicalRecordPayload) => {
  const formData = new FormData();
  formData.append('visitId', payload.visitId);
  formData.append('title', payload.title);
  formData.append('symptoms', payload.symptoms);
  formData.append('diagnosis', payload.diagnosis);
  formData.append('treatments', payload.treatments);
  if (payload.notes) {
    formData.append('notes', payload.notes);
  }
  if (payload.fileIds) {
    formData.append('fileIds', payload.fileIds.join(','));
  }
  if (payload.files) {
    payload.files.forEach((file) => {
      formData.append('files', file);
    });
  }
  return fetcher<IMedicalRecord>(
    {
      url: path.medicalRecord,
      method: 'POST',
      data: formData,
    },
    {
      isFormData: true,
    }
  );
};

const updateMedicalRecord = async (
  id: string,
  payload: UpdateMedicalRecordPayload
) => {
  return fetcher<IMedicalRecord>({
    url: `${path.medicalRecord}/${id}`,
    method: 'PUT',
    data: payload,
  });
};

const deleteMedicalRecord = async (id: string) => {
  return fetcher<void>({
    url: `${path.medicalRecord}/${id}`,
    method: 'DELETE',
  });
};

// ===============================
// VISIT SERVICE API
// ===============================
type CreateVisitServicesPayload = {
  items: CreateVisitServicePayload[];
};

const createVisitServices = async (payload: CreateVisitServicesPayload) => {
  return fetcher<IVisitService[]>({
    url: `${path.visitService}/bulk`,
    method: 'POST',
    data: payload,
  });
};

const getVisitServicesByVisitId = async (visitId: string) => {
  return fetcher<IVisitService[]>({
    url: `${path.visitService}/visit/${visitId}`,
    method: 'GET',
  });
};

const createVisitService = async (payload: CreateVisitServicePayload) => {
  return fetcher<IVisitService>({
    url: path.visitService,
    method: 'POST',
    data: payload,
  });
};

const updateVisitService = async (
  id: string,
  payload: UpdateVisitServicePayload
) => {
  return fetcher<IVisitService>({
    url: `${path.visitService}/${id}`,
    method: 'PUT',
    data: payload,
  });
};

const deleteVisitService = async (id: string) => {
  return fetcher<void>({
    url: `${path.visitService}/${id}`,
    method: 'DELETE',
  });
};

const deleteFileAsset = async (fileId: string) => {
  return fetcher<void>({
    url: `/file-asset/${fileId}`,
    method: 'DELETE',
  });
};

export default {
  // Medical Record
  getMedicalRecords,
  getMedicalRecordById,
  getMedicalRecordsByVisitId,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  // Visit Service
  getVisitServicesByVisitId,
  createVisitService,
  updateVisitService,
  deleteVisitService,
  createVisitServices,
  // File Asset
  deleteFileAsset,
};
