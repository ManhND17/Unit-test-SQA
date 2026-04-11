import { EAppointmentStatus, EAppointmentType } from '@src/types';
import { fetcher, fetcherWithMetadata, IDataWithMeta } from './Fetcher';
import { FormAppointment } from '@src/dto/appointment.dto';

const path = {
  appointments: '/appointments',
  availableSlots: '/appointments/available-slots',
};

type AvailableSlotsQueryParams = {
  doctorId: string;
  date: string;
  departmentId?: number;
  medicalServiceId?: string;
  slotDuration?: number;
};

type AppointmentQueryParams = {
  page?: number;
  limit?: number;
  status?: EAppointmentStatus;
  doctorId?: string;
  patientId?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type AvailableSlotDto = {
  start: string;
  end: string;
  scheduleId: string;
  roomId: string;
  roomName: string;
  departmentId: number;
  departmentName: string;
  availableCount: number; // Số chỗ còn trống
  maxSlot: number; // Tổng số chỗ
};

type AvailableSlotsResponseDto = {
  date: Date;
  doctorId: string;
  doctorName: string;
  medicalService?: {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
  } | null;
  slots: AvailableSlotDto[];
  totalSlots: number;
};

export type AppointmentResponseDto = {
  id: string;
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    patientId: string;
  };
  medicalService: {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
  };
  department?: {
    id: number;
    name: string;
  };
  doctor: {
    id: string;
    name: string;
    specialization: string;
    level: string;
    avatar: string | null;
  };
  schedule?: {
    id: string;
    room: string;
    department: string;
  } | null;
  type: string;
  startTime: string;
  endTime: Date | null;
  reason: string;
  reasonCancel: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  bookedBy?: {
    id: string;
    name: string;
  } | null;
};

export interface CreateAppointmentBody {
  doctorId: string | null;
  patientId: string | null;
  medicalServiceId: string | null;
  departmentId: number | null;
  scheduleId: string | null;
  type: EAppointmentType;
  startTime: string;
  endTime: string | null;
  reason: string;
  notes: string | null;
}

export interface UpdateAppointmentBody {
  doctorId?: string | null;
  patientId?: string | null;
  medicalServiceId?: string | null;
  scheduleId?: string | null;
  type?: EAppointmentType;
  startTime?: string;
  endTime?: string | null;
  reason?: string;
  notes?: string | null;
}

export interface CancelAppointmentBody {
  reason: string;
}

const getAvailableSlots = async (
  params: AvailableSlotsQueryParams
): Promise<AvailableSlotsResponseDto> => {
  return fetcher({
    url: path.availableSlots,
    method: 'GET',
    params,
  });
};

const getListAppointments = async (
  params: AppointmentQueryParams
): Promise<IDataWithMeta<AppointmentResponseDto[]>> => {
  return fetcherWithMetadata({
    url: path.appointments,
    method: 'GET',
    params,
  });
};

const getDetailAppointment = async (
  id: string
): Promise<AppointmentResponseDto> => {
  return fetcher({
    url: `${path.appointments}/${id}`,
    method: 'GET',
  });
};

const createNewAppointment = async (
  data: FormAppointment
): Promise<AppointmentResponseDto> => {
  const body: CreateAppointmentBody = {
    doctorId: data.doctorId ?? null,
    patientId: data.patientId ?? null,
    departmentId: data.departmentId ?? null,
    medicalServiceId: data.medicalServiceId ?? null,
    scheduleId: data.scheduleId ?? null,
    type: data.type,
    startTime: data.startTime,
    endTime: data.endTime,
    reason: data.reason,
    notes: data.notes,
  };
  return fetcher({
    url: path.appointments,
    method: 'POST',
    data: body,
  });
};

const updateAppointment = async (
  id: string,
  data: UpdateAppointmentBody
): Promise<AppointmentResponseDto> => {
  return fetcher({
    url: `${path.appointments}/${id}`,
    method: 'PUT',
    data,
  });
};

const cancelAppointment = async (
  id: string,
  data: CancelAppointmentBody
): Promise<AppointmentResponseDto> => {
  return fetcher({
    url: `${path.appointments}/${id}/cancel`,
    method: 'PATCH',
    data,
  });
};

const approveAppointment = async (id: string) => {
  return fetcher({
    url: `${path.appointments}/${id}/approve`,
    method: 'PATCH',
  });
};

const rejectAppointment = async (id: string, reason: string) => {
  return fetcher({
    url: `${path.appointments}/${id}/reject`,
    method: 'PATCH',
    data: { reasonCancel: reason },
  });
};

export default {
  getAvailableSlots,
  getListAppointments,
  getDetailAppointment,
  createNewAppointment,
  updateAppointment,
  cancelAppointment,
  approveAppointment,
  rejectAppointment,
};
