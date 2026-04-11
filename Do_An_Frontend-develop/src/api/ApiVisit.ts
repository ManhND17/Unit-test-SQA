import { EVisitStatus, IVisit, IVisitService } from '@src/types';
import { fetcher, fetcherWithMetadata, IMetadata, QueryParam } from './Fetcher';

const path = {
  visit: '/visits',
};

type VisitsQueryParams = QueryParam & {
  fromDate?: string;
  toDate?: string;
};

type StaticVisitsByAdminResponse = {
  fromDate: string;
  toDate: string;
  waiting: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  total: number;
};

const staticVisitsByAdmin = async (params: VisitsQueryParams) => {
  return fetcher<StaticVisitsByAdminResponse>({
    url: path.visit + '/stats',
    method: 'GET',
    params,
  });
};

const getVisitsByDayByHospital = async (
  params: QueryParam & {
    fromDate?: string;
    toDate?: string;
    status?: string;
    doctorId?: string;
  }
) => {
  return fetcherWithMetadata<IVisit[]>({
    url: path.visit + '/by-date',
    method: 'GET',
    params,
  });
};

const getVisitsOfPatient = async (
  patientId: string,
  params?: VisitsQueryParams
) => {
  return fetcherWithMetadata<IVisit[]>({
    url: `${path.visit}/patient/${patientId}`,
    method: 'GET',
    params,
  });
};

const getVisitDetail = async (visitId: string) => {
  return fetcher<IVisit>({
    url: `${path.visit}/${visitId}`,
    method: 'GET',
  });
};

type CreateVisitPayload = {
  appointmentId?: string;
  medicalServiceId?: string;
  doctorId?: string;
  status?: EVisitStatus;
  startTime?: string;
  type?: string;
  note?: string;
  patientUserId: string;
};

const createVisit = async (payload: CreateVisitPayload) => {
  return fetcher<IVisit>({
    url: path.visit,
    method: 'POST',
    data: payload,
  });
};

type ServiceUsagesResponse = {
  items: IVisitService[];
  pagination: IMetadata;
  summary: {
    totalCount: number;
    totalCost: number;
    byStatus: Record<
      string,
      {
        count: number;
        totalCost: number;
      }
    >;
  };
};

const getServiceUsageByVisitId = async (visitId: string) => {
  return fetcher<ServiceUsagesResponse>({
    url: `${path.visit}/${visitId}/service-usages`,
    method: 'GET',
  });
};

const updateVisitStatus = async (visitId: string, status: EVisitStatus) => {
  return fetcher<IVisit>({
    url: `${path.visit}/${visitId}/status`,
    method: 'PATCH',
    data: { status },
  });
};

const updateVisitNextVisitDate = async (
  visitId: string,
  nextVisitDate: string | null
) => {
  return fetcher<IVisit>({
    url: `${path.visit}/${visitId}/next-visit-date`,
    method: 'PATCH',
    data: { nextVisitDate },
  });
};

const searchVisits = async (
  params: QueryParam & {
    patientId: string;
    fromDate?: string;
    toDate?: string;
    status?: EVisitStatus;
  }
) => {
  return fetcherWithMetadata<IVisit[]>({
    url: path.visit + '/search',
    method: 'GET',
    params,
  });
};

type VisitTasks = IVisit & {
  taskSource: 'visit' | 'visit_service';
};

const getTasksOfDoctor = async (
  doctorId: string,
  params?: QueryParam & {
    fromDate?: string;
    toDate?: string;
    status?: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  }
) => {
  return fetcherWithMetadata<VisitTasks[]>({
    url: `${path.visit}/doctor/${doctorId}/tasks`,
    method: 'GET',
    params,
  });
};

export default {
  staticVisitsByAdmin,
  getVisitsByDayByHospital,
  getVisitsOfPatient,
  getVisitDetail,
  createVisit,
  getServiceUsageByVisitId,
  updateVisitStatus,
  updateVisitNextVisitDate,
  searchVisits,
  getTasksOfDoctor,
};
