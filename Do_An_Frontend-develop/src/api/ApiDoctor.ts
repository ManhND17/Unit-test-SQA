import { IDoctor } from 'src/types';
import { fetcher, fetcherWithMetadata } from './Fetcher';
import type { QueryParam } from './Fetcher';

const path = {
  list: '/doctors',
  search: '/doctors/search',
  top: '/doctors/top',
  stats: '/doctors/stats',
  bySpecialization: (s: string) =>
    `/doctors/specialization/${encodeURIComponent(s)}`,
  byDepartment: (id: string | number) => `/doctors/department/${id}`,
  getById: (id: string | number) => `/doctors/${id}`,
  schedules: (id: string | number) => `/doctors/${id}/schedules`,
};

export type QueryParamsDoctors = QueryParam & {
  departmentId?: string | number;
  medicalServiceId?: string;
};

const getListDoctor = async (params?: QueryParam) => {
  return fetcherWithMetadata<IDoctor[]>({
    url: path.list,
    method: 'GET',
    params,
  });
};

const getDoctors = async (params: QueryParamsDoctors) => {
  return fetcherWithMetadata<IDoctor[]>({
    url: path.list,
    method: 'GET',
    params,
  });
};

const searchDoctors = async (q?: string, params?: QueryParam) => {
  return fetcher({
    url: path.search,
    method: 'GET',
    params: { q, ...params },
  });
};

const getTopDoctors = async (limit?: number) => {
  return fetcher({
    url: path.top,
    method: 'GET',
    params: { limit },
  });
};

const getDoctorStats = async (params?: Record<string, any>) => {
  return fetcher({
    url: path.stats,
    method: 'GET',
    params,
  });
};

const getDoctorsBySpecialization = async (
  specialization: string,
  params?: QueryParam
) => {
  return fetcher({
    url: path.bySpecialization(specialization),
    method: 'GET',
    params,
  });
};

const getDoctorsByDepartment = async (
  departmentId: string | number,
  params?: QueryParam
) => {
  return fetcherWithMetadata<IDoctor[]>({
    url: path.byDepartment(departmentId),
    method: 'GET',
    params,
  });
};

const getDoctorById = async (id: string | number) => {
  return fetcher<IDoctor>({
    url: path.getById(id),
    method: 'GET',
  });
};

const getDoctorSchedules = async (id: string | number) => {
  return fetcher({
    url: path.schedules(id),
    method: 'GET',
  });
};

export default {
  getListDoctor,
  getDoctors,
  searchDoctors,
  getTopDoctors,
  getDoctorStats,
  getDoctorsBySpecialization,
  getDoctorsByDepartment,
  getDoctorById,
  getDoctorSchedules,
};
