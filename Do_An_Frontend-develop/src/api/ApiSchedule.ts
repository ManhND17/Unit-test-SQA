import { ISchedule } from 'src/types';
import { fetcher, fetcherWithMetadata, QueryParam } from './Fetcher';

const path = {
  create: '/schedules/create',
  update: `/schedules/update/`,
  delete: (id: string | number) => `/schedules/delete/${id}`,
  getById: (id: string | number) => `/schedules/${id}`,
  list: '/schedules/doctor',
  listAdmin: '/schedules',
  approve: (id: string | number) => `/schedules/approve/${id}`,
  reject: (id: string | number) => `/schedules/reject/${id}`,
};

export interface ScheduleQueryParams extends QueryParam {
  staffId?: string | number;
  departmentId?: string | number;
  doctorId?: string | number;
  date: string;
}
export const createSchedule = (data: Partial<ISchedule>) => {
  return fetcherWithMetadata<ISchedule>(
    {
      url: path.create,
      method: 'POST',
      data,
    },
    { displayError: true, withToken: true }
  );
};
export const updateSchedule = (data: Partial<ISchedule>) => {
  return fetcherWithMetadata<ISchedule>(
    {
      url: path.update,
      method: 'PUT',
      data,
    },
    {
      displayError: false,
      withToken: true,
    }
  );
};
export const deleteSchedule = (id: string | number) => {
  return fetcherWithMetadata<void>(
    {
      url: path.delete(id),
      method: 'DELETE',
    },
    { displayError: true, withToken: true }
  );
};
export const getSchedules = (params?: ScheduleQueryParams) => {
  return fetcher<ISchedule[]>(
    {
      url: path.list,
      method: 'GET',
      params,
    },
    { withToken: true }
  );
};
export const getScheduleById = (id: string | number) => {
  return fetcher<ISchedule>(
    {
      url: path.getById(id),
      method: 'GET',
    },
    { withToken: true }
  );
};
export const getSchedulesAdmin = (params?: ScheduleQueryParams) => {
  return fetcher<ISchedule[]>(
    {
      url: path.listAdmin,
      method: 'GET',
      params,
    },
    { withToken: true }
  );
};

export const approveScheduleAdmin = (id: string | number) => {
  return fetcherWithMetadata<ISchedule>(
    {
      url: path.approve(id),
      method: 'PUT',
    },
    { withToken: true }
  );
};
export const rejectScheduleAdmin = (id: string | number) => {
  return fetcherWithMetadata<ISchedule>(
    {
      url: path.reject(id),
      method: 'PUT',
    },
    { withToken: true }
  );
};
