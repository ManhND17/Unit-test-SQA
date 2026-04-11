import { IUser } from '@src/types';
import { fetcher, fetcherWithMetadata, QueryParam } from './Fetcher';

const path = {
  listpatients: '/adminusers/patients/all',
  liststaffs: '/adminusers/staffs/all',
  doctorcreate: '/adminusers/doctors/create',
  doctorupdate: (id: string | number) => `/adminusers/doctors/update/${id}`,
  admincreate: '/adminusers/admins/create',
  adminupdate: (id: string | number) => `/adminusers/admins/update/${id}`,
  patientcreate: '/adminusers/patients/create',
  patientupdate: (id: string | number) => `/adminusers/patients/update/${id}`,
  statisticStaff: '/adminusers/staffs/stats',
  statisticPatient: '/adminusers/patients/stats',
};

type StatisticStaff = {
  total: number;
  byRole: {
    [role: string]: number;
  };
};

type StatisticPatient = {
  total: number;
  byGender: {
    [gender: string]: number;
  };
  withHealthInsurance: number;
  withEHR: number;
  withAppointment: number;
  ageGroups: {
    [ageGroup: string]: number;
  };
};

const getAllPatients = (params?: QueryParam) => {
  return fetcherWithMetadata<IUser[]>({
    url: path.listpatients,
    method: 'GET',
    params,
  });
};

const getAllStaffs = (params?: QueryParam) => {
  return fetcherWithMetadata<IUser[]>({
    url: path.liststaffs,
    method: 'GET',
    params,
  });
};

const createDoctor = (data: Partial<IUser>) => {
  return fetcher<IUser>({
    url: path.doctorcreate,
    method: 'POST',
    data,
  });
};

const updateDoctor = (id: string | number, data: Partial<IUser>) => {
  return fetcher<IUser>({
    url: path.doctorupdate(id),
    method: 'PUT',
    data,
  });
};

const createAdmin = (data: Partial<IUser>) => {
  return fetcher<IUser>({
    url: path.admincreate,
    method: 'POST',
    data,
  });
};

const updateAdmin = (id: string | number, data: Partial<IUser>) => {
  return fetcher<IUser>({
    url: path.adminupdate(id),
    method: 'PUT',
    data,
  });
};

const createPatient = (data: Partial<IUser>) => {
  return fetcher<IUser>({
    url: path.patientcreate,
    method: 'POST',
    data,
  });
};

const updatePatient = (id: string | number, data: Partial<IUser>) => {
  return fetcher<IUser>({
    url: path.patientupdate(id),
    method: 'PUT',
    data,
  });
};

const statisticStaff = () => {
  return fetcher<StatisticStaff>({
    url: path.statisticStaff,
    method: 'GET',
  });
};

const statisticPatient = () => {
  return fetcher<StatisticPatient>({
    url: path.statisticPatient,
    method: 'GET',
  });
};

export default {
  getAllPatients,
  getAllStaffs,
  createDoctor,
  updateDoctor,
  createAdmin,
  updateAdmin,
  createPatient,
  updatePatient,
  statisticStaff,
  statisticPatient,
};
