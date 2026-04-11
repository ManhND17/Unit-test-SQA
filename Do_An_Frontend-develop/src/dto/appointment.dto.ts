import {
  EAppointmentType,
  IDepartment,
  IDoctor,
  IMedicalService,
  IPatient,
  ISchedule,
} from '@src/types';
import { z } from 'zod';

export interface FormAppointment {
  doctor: IDoctor | null;
  department: IDepartment | null;
  medicalService: IMedicalService | null;
  patient: IPatient | null;
  schedule: ISchedule | null;
  type: EAppointmentType;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  notes: string;
  termsAccepted: boolean;
  // ID fields for API calls
  doctorId?: string;
  departmentId?: number;
  medicalServiceId?: string;
  patientId?: string;
  scheduleId?: string;
}

export const CreateAppointmentSchema = z.object({
  doctorId: z.string().optional().nullable().default(null),
  patientId: z.string().optional().nullable().default(null),
  departmentId: z.number().optional().nullable().default(null),
  scheduleId: z.string().optional().nullable().default(null),
  medicalServiceId: z
    .string()
    .optional()
    .describe(
      'ID của dịch vụ khám (optional). Nếu có, appointment sẽ gắn với dịch vụ cụ thể'
    )
    .nullable()
    .default(null),
  type: z
    .enum(['new', 'followUp', 'checkUp', 'consultation', 'telehealth'], {
      message: 'Loại cuộc hẹn không hợp lệ',
    })
    .optional()
    .default('new'),
  startTime: z
    .string()
    .min(1, 'Thời gian bắt đầu không được để trống')
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'Thời gian bắt đầu không hợp lệ' }
    ),
  endTime: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'Thời gian kết thúc không hợp lệ' }
    ),
  reason: z
    .string()
    .min(10, 'Lý do khám phải có ít nhất 10 ký tự')
    .max(500, 'Lý do khám không được quá 500 ký tự'),
  notes: z.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional(),
});

export type CreateAppointmentDto = z.infer<typeof CreateAppointmentSchema>;
