import { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CalendarIcon,
  ClipboardIcon,
} from 'lucide-react';
import StepIndicator from '@pages/Patient/Appointment/components/StepIndicator';
import DepartmentSelect from '@pages/Patient/Appointment/components/DepartmentSelect';
import MedicalServiceSelect from '@pages/Patient/Appointment/components/MedicalServiceSelect';
import DoctorCard from '@pages/Patient/Appointment/components/DoctorCard';
import Calendar from '@components/Calendar';
import TimeSlotGrid from '@pages/Patient/Appointment/components/TimeSlotGrid';
import { FormAppointment } from '@dto/appointment.dto';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import ApiAppointment, { AppointmentResponseDto } from '@api/ApiAppointment';
import {
  EAppointmentType,
  IDepartment,
  IDoctor,
  IMedicalService,
} from '@src/types';
import { toast } from 'react-toastify';
import { IDataError } from '@src/api/Fetcher';
import { formatTimeFromIso } from '@src/utils/datetime';
import QUERY_KEY from '@src/api/QueryKey';
import ApiDepartment from '@src/api/ApiDepartment';
import ApiMedicalService from '@src/api/ApiMedicalService';
import ApiDoctor from '@src/api/ApiDoctor';
import CommonModal from '@src/components/Modal';

const steps = [
  {
    id: 1,
    title: 'Thông tin khám',
    isCompleted: false,
    isActive: true,
  },
  {
    id: 2,
    title: 'Thời gian',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 3,
    title: 'Xác nhận',
    isCompleted: false,
    isActive: false,
  },
];

interface ModalEditAppointmentProps {
  open: boolean;
  onClose: () => void;
  appointment: AppointmentResponseDto | null;
  onSuccess?: () => void;
}

export default function ModalEditAppointment({
  open,
  onClose,
  appointment,
  onSuccess,
}: ModalEditAppointmentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openPolicy, setOpenPolicy] = useState(false);

  const methods = useForm<FormAppointment>({
    mode: 'onBlur',
  });

  const {
    trigger,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = methods;

  // Watch form values for reactive updates
  const department = watch('department') as IDepartment | null | undefined;
  const departmentId = watch('departmentId') as number | undefined;
  const medicalService = watch('medicalService') as
    | IMedicalService
    | null
    | undefined;
  const doctor = watch('doctor') as IDoctor | null | undefined;
  const doctorId = watch('doctorId') as string | undefined;
  const appointmentDate = watch('date') as string | undefined;
  const startTime = watch('startTime') as string | undefined;

  const { data: departments } = useQuery({
    queryKey: [
      QUERY_KEY.DEPARMENT.GET_LIST_DEPARTMENT,
      'clinical,paraclinical',
    ],
    queryFn: () =>
      ApiDepartment.getDepartments({
        type: 'clinical,paraclinical',
      }),
    staleTime: Infinity,
  });

  const { data: medicalServices } = useQuery({
    queryKey: [
      QUERY_KEY.MEDICAL_SERVICE.GET_LIST_MEDICAL_SERVICE,
      departmentId,
    ],
    queryFn: () =>
      ApiMedicalService.getMedicalServices({
        isActive: 1,
        departmentId: departmentId as number,
      }),
    enabled: !!departmentId,
  });

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: [
      QUERY_KEY.DOCTOR.GET_LIST_DOCTOR,
      departmentId,
      watch('medicalServiceId'),
    ],
    queryFn: () =>
      ApiDoctor.getDoctors({
        departmentId: departmentId,
        medicalServiceId: watch('medicalServiceId'),
      }),
    enabled: !!departmentId,
  });

  const { data: availableSlots } = useQuery({
    queryKey: [
      QUERY_KEY.APPOINTMENT.GET_AVAILABLE_SLOTS,
      doctorId,
      appointmentDate,
    ],
    queryFn: () =>
      ApiAppointment.getAvailableSlots({
        doctorId: doctorId as string,
        date: appointmentDate as string,
      }),
    enabled: !!doctorId && !!appointmentDate,
  });

  const { mutate: updateAppointment } = useMutation({
    onMutate: () => {
      setIsSubmitting(true);
    },
    mutationFn: (data: FormAppointment) => {
      return ApiAppointment.updateAppointment(appointment!.id, {
        doctorId: data.doctorId || null,
        patientId: data.patientId || null,
        medicalServiceId: data.medicalServiceId || null,
        scheduleId: data.scheduleId || null,
        type: data.type,
        startTime: data.startTime,
        endTime: data.endTime,
        reason: data.reason,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      toast.success('Cập nhật lịch hẹn thành công');
      setIsSubmitting(false);
      onSuccess?.();
      handleClose();
    },
    onError: (error: IDataError) => {
      toast.error(error.errorMessage || 'Cập nhật lịch hẹn thất bại');
      setIsSubmitting(false);
    },
  });

  // Initialize form with appointment data
  useEffect(() => {
    if (appointment && open) {
      const appointmentStartDate = new Date(appointment.startTime);
      reset({
        doctor: appointment.doctor,
        department: appointment.department,
        departmentId: appointment.department.id,
        medicalService: appointment.medicalService,
        medicalServiceId: appointment.medicalService.id,
        doctorId: appointment.doctor.id,
        patientId: appointment.patient.id,
        scheduleId: appointment.schedule?.id,
        type: appointment.type as EAppointmentType,
        date: appointmentStartDate.toISOString(),
        startTime: appointment.startTime,
        endTime: appointment.endTime?.toString() || '',
        reason: appointment.reason,
        notes: appointment.notes || '',
        termsAccepted: true,
      });
      setCurrentStep(1);
    }
  }, [appointment, open, reset]);

  const handleNextStep = async () => {
    // Validate step 1: department is required
    if (currentStep === 1) {
      if (!department) {
        toast.error('Vui lòng chọn chuyên khoa');
        return;
      }
      if (!medicalService) {
        toast.error('Vui lòng chọn dịch vụ khám');
        return;
      }
    }

    // Validate step 2: date and time are required
    if (currentStep === 2) {
      if (!appointmentDate) {
        toast.error('Vui lòng chọn ngày khám');
        return;
      }
      if (!startTime) {
        toast.error('Vui lòng chọn giờ khám');
        return;
      }
    }
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const isValid = await trigger(['reason', 'notes', 'termsAccepted']);
    if (!isValid) return;

    if (!watch('termsAccepted')) {
      toast.error('Vui lòng đồng ý với điều khoản sử dụng');
      return;
    }

    const formData = getValues();
    updateAppointment(formData);
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  if (!appointment) return null;

  return (
    <CommonModal open={open} onClose={handleClose} title="Chỉnh sửa lịch hẹn">
      <div className="relative">
        {/* Step Indicator */}
        <div className="py-4">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <div className="py-6 max-h-[60vh] overflow-y-auto">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <ClipboardIcon className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Chọn dịch vụ & Bác sĩ
                  </h3>
                  <p className="text-sm text-gray-500">
                    Chọn chuyên khoa và loại dịch vụ khám bệnh
                  </p>
                </div>
              </div>

              <DepartmentSelect
                departments={departments?.departments ?? []}
                selectedId={department?.id || null}
                onChange={(id) => {
                  const selectedDept =
                    departments?.departments.find((d) => d.id === id) || null;
                  setValue('department', selectedDept, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setValue('departmentId', id, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  // Reset dependent fields
                  setValue('medicalService', null, {
                    shouldValidate: true,
                  });
                  setValue('medicalServiceId', undefined, {
                    shouldValidate: true,
                  });
                  setValue('doctor', null, { shouldValidate: true });
                  setValue('doctorId', undefined, {
                    shouldValidate: true,
                  });
                }}
              />

              <MedicalServiceSelect
                data={medicalServices?.data || []}
                selectedId={medicalService?.id?.toString() || undefined}
                onChange={(id) => {
                  const selectedService =
                    medicalServices?.data.find((s) => s.id.toString() === id) ||
                    null;
                  setValue('medicalService', selectedService);
                  setValue('medicalServiceId', selectedService?.id?.toString());
                }}
              />

              <DoctorCard
                doctors={doctors?.data || []}
                selectedId={(doctor?.userId ?? doctor?.user?.id) || null}
                onChange={(id) => {
                  const selectedDoctor =
                    doctors?.data.find(
                      (d) => (d.userId ?? d.user?.id) === id
                    ) || null;
                  setValue('doctor', selectedDoctor);
                  setValue('doctorId', id || undefined);
                }}
                isLoading={isLoadingDoctors}
                disabled={department === null}
              />
            </div>
          )}

          {/* Step 2: Time Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Chọn thời gian
                  </h3>
                  <p className="text-sm text-gray-500">
                    Chọn ngày và giờ khám phù hợp với bạn
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Calendar
                  selectedDate={
                    appointmentDate ? new Date(appointmentDate) : new Date()
                  }
                  onChange={(date) => setValue('date', date.toISOString())}
                  error={errors.date?.message}
                />

                <TimeSlotGrid
                  slots={
                    availableSlots?.slots.map((s) => ({
                      start: s.start,
                      end: s.end,
                      available: true,
                      scheduleId: s.scheduleId,
                    })) || []
                  }
                  selectedTime={startTime as string}
                  onChange={(slot) => {
                    setValue('startTime', slot.start);
                    setValue('endTime', slot.end);
                    setValue('scheduleId', slot.scheduleId);
                  }}
                  disabled={!appointmentDate}
                />
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Xác nhận thông tin
                  </h3>
                  <p className="text-sm text-gray-500">
                    Kiểm tra và xác nhận lịch hẹn của bạn
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-4 sm:p-6 space-y-3">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Thông tin lịch hẹn
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between sm:flex-col">
                    <span className="text-gray-500">Chuyên khoa</span>
                    <span className="font-medium text-gray-900">
                      {department?.name}
                    </span>
                  </div>
                  <div className="flex justify-between sm:flex-col">
                    <span className="text-gray-500">Dịch vụ</span>
                    <span className="font-medium text-gray-900">
                      {medicalService?.name}
                    </span>
                  </div>
                  <div className="flex justify-between sm:flex-col">
                    <span className="text-gray-500">Bác sĩ</span>
                    <span className="font-medium text-gray-900">
                      {doctor
                        ? `${doctor?.user?.name?.firstName} ${doctor?.user?.name?.lastName}`
                        : 'Hệ thống chọn'}
                    </span>
                  </div>
                  <div className="flex justify-between sm:flex-col">
                    <span className="text-gray-500">Ngày khám</span>
                    <span className="font-medium text-gray-900">
                      {appointmentDate
                        ? new Date(
                            appointmentDate as string
                          ).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                          })
                        : 'Chưa chọn'}
                    </span>
                  </div>
                  <div className="flex justify-between sm:flex-col sm:col-span-2">
                    <span className="text-gray-500">Giờ khám</span>
                    <span className="font-medium text-teal-600 text-lg">
                      {formatTimeFromIso(startTime as string)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label
                  htmlFor="reason"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Lý do khám / Triệu chứng{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reason"
                  value={(watch('reason') as string) || ''}
                  onChange={(e) => setValue('reason', e.target.value)}
                  placeholder="Nhập triệu chứng (ví dụ: đau đầu, sốt cao 3 ngày...)"
                  rows={4}
                  className={`
                    w-full px-4 py-3 border rounded-xl resize-none
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                    transition-colors
                    ${errors.reason ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                />
                {errors.reason && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span aria-hidden="true">⚠</span> {errors.reason.message}
                  </p>
                )}
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label
                  htmlFor="notes"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Ghi chú (nếu có)
                </label>
                <textarea
                  id="notes"
                  value={(watch('notes') as string) || ''}
                  onChange={(e) => setValue('notes', e.target.value)}
                  placeholder="Nhập ghi chú thêm ..."
                  rows={4}
                  className={`
                    w-full px-4 py-3 border rounded-xl resize-none
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                    transition-colors
                    ${errors.notes ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                />
                {errors.notes && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span aria-hidden="true">⚠</span> {errors.notes.message}
                  </p>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={(watch('termsAccepted') as boolean) || false}
                    onChange={(e) =>
                      setValue('termsAccepted', e.target.checked)
                    }
                    className="mt-1 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />

                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Tôi cam kết thông tin khai báo là chính xác và đồng ý với{' '}
                    <button
                      type="button"
                      onClick={() => setOpenPolicy(!openPolicy)}
                      className="text-teal-600 hover:underline font-medium"
                    >
                      điều khoản sử dụng
                    </button>
                  </span>
                </label>

                {/* Collapse Terms */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    openPolicy ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <ul className="ml-8 mt-2 list-disc text-sm text-gray-600 space-y-1">
                    <li>
                      Thông tin cá nhân cung cấp phải chính xác và trung thực.
                    </li>
                    <li>
                      Chỉ được phép thay đổi, hủy lịch hẹn muộn nhất{' '}
                      <b>24 giờ</b> trước giờ khám đã đặt.
                    </li>
                    <li>Đi khám đúng giờ đã đặt lịch.</li>
                    <li>Chịu trách nhiệm về các quy định của bệnh viện.</li>
                  </ul>
                </div>
              </div>
              {errors.termsAccepted && (
                <p className="text-sm text-red-600 flex items-center gap-1 -mt-4">
                  <span aria-hidden="true">⚠</span>{' '}
                  {errors.termsAccepted.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <button
            type="button"
            onClick={currentStep === 1 ? handleClose : handlePrevStep}
            className="px-6 py-3 text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors order-2 sm:order-1"
          >
            {currentStep === 1 ? (
              'HỦY BỎ'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <ArrowLeftIcon className="w-4 h-4" />
                QUAY LẠI
              </span>
            )}
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              TIẾP TỤC
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  CẬP NHẬT LỊCH HẸN
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </CommonModal>
  );
}
