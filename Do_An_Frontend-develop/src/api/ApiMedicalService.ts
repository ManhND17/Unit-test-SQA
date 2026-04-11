import { IMedicalService, IDoctorService } from 'src/types';
import { fetcher } from './Fetcher';
import type { QueryParam, IMetadata } from './Fetcher';

const path = {
  list: '/medical-services',
  popular: '/medical-services/popular',
  priceRange: '/medical-services/price-range',
  byDepartment: (id: string | number) => `/medical-services/department/${id}`,
  getById: (id: string | number) => `/medical-services/${id}`,
  create: '/medical-services/create',
  update: (id: string | number) => `/medical-services/update/${id}`,
  delete: (id: string | number) => `/medical-services/delete/${id}`,
  createDoctorService: '/medical-services/doctor-service/create',
  deleteDoctorService: (
    doctorId: string | number,
    medicalServiceId: string | number
  ) =>
    `/medical-services/doctor-service/delete/${doctorId}/${medicalServiceId}`,
};

type MedicalServiceListResponse = {
  data: IMedicalService[];
  metadata?: IMetadata;
};

export interface MedicalServiceQueryParams extends QueryParam {
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'price';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  departmentId?: number;
  specialization?: string;
  isActive?: number;
  minPrice?: number;
}

const getMedicalServices = async (params?: MedicalServiceQueryParams) =>
  fetcher<MedicalServiceListResponse>({
    url: path.list,
    method: 'GET',
    params,
  });

const getPopularServices = async (limit?: number) =>
  fetcher<IMedicalService[]>({
    url: path.popular,
    method: 'GET',
    params: { limit },
  });

const getServicesByPriceRange = async (minPrice: number, maxPrice: number) =>
  fetcher<IMedicalService[]>({
    url: path.priceRange,
    method: 'GET',
    params: { minPrice, maxPrice },
  });

const getServicesByDepartment = async (
  departmentId: string | number,
  params?: QueryParam
) =>
  fetcher<IMedicalService[]>({
    url: path.byDepartment(departmentId),
    method: 'GET',
    params,
  });

const getMedicalServiceById = async (id: string | number) =>
  fetcher<IMedicalService>({
    url: path.getById(id),
    method: 'GET',
  });
const createMedicalService = async (data: Partial<IMedicalService>) =>
  fetcher<IMedicalService>({
    url: path.create,
    method: 'POST',
    data,
  });

const updateMedicalService = async (
  id: string | number,
  data: Partial<IMedicalService>
) =>
  fetcher<IMedicalService>({
    url: path.update(id),
    method: 'PUT',
    data,
  });

const deleteMedicalService = async (id: string | number) =>
  fetcher<void>({
    url: path.delete(id),
    method: 'DELETE',
  });

const createDoctorService = async (data: Partial<IDoctorService>) =>
  fetcher<IMedicalService>({
    url: path.createDoctorService,
    method: 'POST',
    data,
  });
const deleteDoctorService = async (
  doctorId: string | number,
  medicalServiceId: string | number
) =>
  fetcher<IMedicalService>({
    url: path.deleteDoctorService(doctorId, medicalServiceId),
    method: 'DELETE',
  });

export default {
  getMedicalServices,
  getPopularServices,
  getServicesByPriceRange,
  getServicesByDepartment,
  getMedicalServiceById,
  createMedicalService,
  updateMedicalService,
  deleteMedicalService,
  createDoctorService,
  deleteDoctorService,
};
