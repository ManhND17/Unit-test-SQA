import { IDepartment } from 'src/types';
import { fetcher, fetcherWithMetadata, IMetadata, QueryParam } from './Fetcher';

const path = {
  list: '/departments',
  getById: (id: string | number) => `/departments/${id}`,
  search: '/departments/search',
  withServices: '/departments/with-services',
  stats: '/departments/stats',
  byCode: (code: string) => `/departments/code/${code}`,
  byType: (type: string) => `/departments/type/${type}`,
  create: '/departments/create',
  update: (id: string | number) => `/departments/update/${id}`,
  delete: (id: string | number) => `/departments/delete/${id}`,
};

type DepartmentStat = {
  totalStaff: number;
  totalServices: number;
  totalDoctors: number;
};

export interface DepartmentQueryParams extends QueryParam {
  sortBy?: 'type' | 'code' | 'name' | 'createdAt' | 'staffCount';
  sortOrder?: 'asc' | 'desc';
  includeStats?: boolean;
  search?: string | undefined;
  type?: string;
  code?: string;
  hasHead?: boolean;
  hasStaff?: boolean;
  hasServices?: boolean;
}

const getDepartments = (params?: DepartmentQueryParams) => {
  return fetcher<{ departments: IDepartment[]; pagination: IMetadata }>({
    url: path.list,
    method: 'GET',
    params,
  });
};

const getDepartmentById = (id: string | number) => {
  return fetcher<IDepartment & { stats: DepartmentStat }>({
    url: path.getById(id),
    method: 'GET',
  });
};

const getDepartmentsByType = (type: string, params?: Record<string, any>) => {
  return fetcherWithMetadata<{ departments: IDepartment[] }>({
    url: path.byType(type),
    method: 'GET',
    params,
  });
};

const searchDepartments = (q: string, limit?: number) => {
  return fetcherWithMetadata<{ departments: IDepartment[] }>({
    url: path.search,
    method: 'GET',
    params: { q, limit },
  });
};

const getDepartmentsWithServices = () => {
  return fetcher<{ departments: IDepartment[] }>({
    url: path.withServices,
    method: 'GET',
  });
};

const getDepartmentStats = (params?: Record<string, any>) => {
  return fetcher<any>({
    url: path.stats,
    method: 'GET',
    params,
  });
};

const createDepartment = (data: Partial<IDepartment>) => {
  return fetcher<IDepartment>({
    url: path.create,
    method: 'POST',
    data,
  });
};
const updateDepartment = (id: string | number, data: Partial<IDepartment>) => {
  return fetcher<IDepartment>({
    url: path.update(id),
    method: 'PUT',
    data,
  });
};
const deleteDepartment = (id: string | number) => {
  return fetcher<any>({
    url: path.delete(id),
    method: 'DELETE',
  });
};

export default {
  getDepartments,
  getDepartmentById,
  getDepartmentsByType,
  searchDepartments,
  getDepartmentsWithServices,
  getDepartmentStats,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
