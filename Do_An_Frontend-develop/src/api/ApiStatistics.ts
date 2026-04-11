import { fetcher } from './Fetcher';

// Types - Admin Dashboard
export interface ISummaryStats {
  id: number;
  title: string;
  value: number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface IStaffByDepartment {
  department: string;
  count: number;
}

export interface IRevenueByDay {
  day: string;
  value: number;
}

export interface IAppointmentByDay {
  day: string;
  value: number;
}

// Types - Doctor Dashboard
export interface IDoctorDashboardSummary {
  completedAppointments: number;
  pendingAppointments: number;
  weeklyAppointments: number;
}

export interface IDoctorAppointmentsByDay {
  labels: string[];
  values: number[];
}

export interface IDoctorAppointmentStatus {
  name: string;
  value: number;
}

// API paths
const path = {
  // Admin dashboard
  statistics: '/statistics',
  summary: '/statistics/admin/dashboard/summary',
  staffByDepartment: '/statistics/admin/dashboard/staff-by-department',
  revenueByDay: '/statistics/admin/dashboard/revenue-by-day',
  appointmentsByDay: '/statistics/admin/dashboard/appointments-by-day',
  // Doctor dashboard
  doctorSummary: '/statistics/doctor/dashboard/summary',
  doctorAppointmentsByDay: '/statistics/doctor/dashboard/appointments-by-day',
  doctorAppointmentStatus: '/statistics/doctor/dashboard/appointment-status',
};

// API functions
const getSummary = async (): Promise<ISummaryStats[]> => {
  return fetcher<ISummaryStats[]>({
    url: path.summary,
    method: 'GET',
  });
};

const getStaffByDepartment = async (): Promise<IStaffByDepartment[]> => {
  return fetcher<IStaffByDepartment[]>({
    url: path.staffByDepartment,
    method: 'GET',
  });
};

const getRevenueByDay = async (): Promise<IRevenueByDay[]> => {
  return fetcher<IRevenueByDay[]>({
    url: path.revenueByDay,
    method: 'GET',
  });
};

const getAppointmentsByDay = async (): Promise<IAppointmentByDay[]> => {
  return fetcher<IAppointmentByDay[]>({
    url: path.appointmentsByDay,
    method: 'GET',
  });
};

// Doctor Dashboard API functions
const getDoctorDashboardSummary =
  async (): Promise<IDoctorDashboardSummary> => {
    return fetcher<IDoctorDashboardSummary>({
      url: path.doctorSummary,
      method: 'GET',
    });
  };

const getDoctorAppointmentsByDay =
  async (): Promise<IDoctorAppointmentsByDay> => {
    return fetcher<IDoctorAppointmentsByDay>({
      url: path.doctorAppointmentsByDay,
      method: 'GET',
    });
  };

const getDoctorAppointmentStatus = async (): Promise<
  IDoctorAppointmentStatus[]
> => {
  return fetcher<IDoctorAppointmentStatus[]>({
    url: path.doctorAppointmentStatus,
    method: 'GET',
  });
};

type GetPatientVisitsStatusStatsResponse = {
  total: string;
  byStatus: Record<string, number>;
};

const getPatientVisitsStatusStats = async (
  patientId: string
): Promise<GetPatientVisitsStatusStatsResponse> => {
  return fetcher({
    url: `${path.statistics}/patient/visits/status`,
    method: 'GET',
    params: { patientId },
  });
};

type GetPatientMonthlyVisitCountsByYearResponse = {
  year: number;
  months: {
    month: string;
    count: number;
  }[];
};

const getPatientMonthlyVisitCountsByYear = async (
  patientId: string,
  year: number
): Promise<GetPatientMonthlyVisitCountsByYearResponse> => {
  return fetcher({
    url: `${path.statistics}/patient/visits/monthly`,
    method: 'GET',
    params: { patientId, year },
  });
};

const ApiStatistics = {
  getSummary,
  getStaffByDepartment,
  getRevenueByDay,
  getAppointmentsByDay,
  // Doctor Dashboard
  getDoctorDashboardSummary,
  getDoctorAppointmentsByDay,
  getDoctorAppointmentStatus,
  getPatientVisitsStatusStats,
  getPatientMonthlyVisitCountsByYear,
};

export default ApiStatistics;
