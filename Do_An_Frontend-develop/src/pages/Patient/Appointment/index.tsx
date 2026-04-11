import { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserIcon,
  ClipboardIcon,
} from 'lucide-react';
import StepIndicator from './components/StepIndicator';
import DepartmentSelect from './components/DepartmentSelect';
import MedicalServiceSelect from './components/MedicalServiceSelect';
import DoctorCard from './components/DoctorCard';
import Calendar from '@components/Calendar';
import TimeSlotGrid from './components/TimeSlotGrid';
import { FormAppointment } from '@dto/appointment.dto';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import ApiAppointment from '@api/ApiAppointment';
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
import { useSelector } from 'react-redux';
import { IRootState } from '@src/redux/store';
import { useSearchParams, useNavigate } from 'react-router-dom';

const initialFormData: FormAppointment = {
  doctor: null,
  department: null,
  departmentId: undefined,
  medicalService: null,
  medicalServiceId: undefined,
  doctorId: undefined,
  patient: null,
  schedule: null,
  type: 'new' as EAppointmentType,
  date: new Date().toISOString(),
  startTime: '',
  endTime: '',
  reason: '',
  notes: '',
  termsAccepted: false,
};

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

interface IBookingFormProps {
  onClose?: () => void;
}

export default function BookingForm({ onClose }: IBookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openPolicy, setOpenPolicy] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const user = useSelector((state: IRootState) => state.auth.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const methods = useForm<FormAppointment>({
    defaultValues: initialFormData,
    mode: 'onBlur',
  });

  const {
    trigger,
    getValues,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = methods;

  // Watch form values for reactive updates
  const department = watch('department') as IDepartment;
  const departmentId = watch('departmentId') as number;
  const medicalService = watch('medicalService') as IMedicalService;
  const doctor = watch('doctor') as IDoctor;
  const doctorId = watch('doctorId') as string;
  const appointmentDate = watch('date');
  const startTime = watch('startTime');

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
        medicalServiceId: watch('medicalServiceId') as string,
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

  const { mutate: createAppointment, data: newAppointment } = useMutation({
    onMutate: () => {
      setIsSubmitting(true);
      setIsSuccess(false);
    },
    mutationFn: (data: FormAppointment) => {
      return ApiAppointment.createNewAppointment(data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast.success('Đặt lịch thành công');
      setIsSubmitting(false);
      setCurrentStep(4);
    },
    onError: (error: IDataError) => {
      toast.error(error.errorMessage || 'Đặt lịch thất bại');
      setIsSubmitting(false);
      setIsSuccess(false);
    },
  });

  // Initialize form values from URL query params
  useEffect(() => {
    const urlDepartmentId = searchParams.get('departmentId');

    // Set departmentId if exists in URL and not already set in form
    if (
      urlDepartmentId &&
      departments?.departments &&
      !getValues('departmentId')
    ) {
      const departmentIdNum = Number(urlDepartmentId);
      const selectedDept = departments.departments.find(
        (d) => d.id === departmentIdNum
      );
      if (selectedDept) {
        setValue('department', selectedDept);
        setValue('departmentId', departmentIdNum);
      }
    }
  }, [searchParams, departments, setValue, getValues]);

  // Set medicalServiceId when medicalServices data is loaded
  useEffect(() => {
    const urlMedicalServiceId = searchParams.get('medicalServiceId');
    if (
      urlMedicalServiceId &&
      medicalServices?.data &&
      !getValues('medicalServiceId')
    ) {
      const selectedService = medicalServices.data.find(
        (s) => s.id.toString() === urlMedicalServiceId
      );
      if (selectedService) {
        setValue('medicalService', selectedService);
        setValue('medicalServiceId', selectedService.id.toString());
      }
    }
  }, [searchParams, medicalServices, setValue, getValues]);

  // Set doctorId when doctors data is loaded
  useEffect(() => {
    const urlDoctorId = searchParams.get('doctorId');
    if (urlDoctorId && doctors?.data && !getValues('doctorId')) {
      const selectedDoctor = doctors.data.find(
        (d) => (d.userId ?? d.user?.id) === urlDoctorId
      );
      if (selectedDoctor) {
        setValue('doctor', selectedDoctor);
        setValue('doctorId', urlDoctorId);
      }
    }
  }, [searchParams, doctors, setValue, getValues]);

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
    const isValid = await trigger(['reason', 'notes']);
    const termsAccepted = getValues('termsAccepted');

    if (!termsAccepted) {
      setError('termsAccepted', {
        type: 'manual',
        message: 'Vui lòng đồng ý với điều khoản sử dụng',
      });
      return;
    }

    if (!isValid) return;

    if (!user) {
      toast.error('Vui lòng đăng nhập để đặt lịch');
      return;
    }

    const formData = getValues();
    createAppointment({
      ...formData,
      patientId: user.patient?.patientId || user.id,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-teal-600" />
            ĐẶT LỊCH KHÁM BỆNH
          </h1>

          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Step Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <ClipboardIcon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Chọn dịch vụ & Bác sĩ
                    </h2>
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
                    setValue('medicalService', null, { shouldValidate: true });
                    setValue('medicalServiceId', undefined, {
                      shouldValidate: true,
                    });
                    setValue('doctor', null, { shouldValidate: true });
                    setValue('doctorId', undefined, { shouldValidate: true });
                  }}
                />

                <MedicalServiceSelect
                  data={medicalServices?.data || []}
                  selectedId={medicalService?.id?.toString() || undefined}
                  onChange={(id) => {
                    const selectedService =
                      medicalServices?.data.find(
                        (s) => s.id.toString() === id
                      ) || null;
                    setValue('medicalService', selectedService);
                    setValue(
                      'medicalServiceId',
                      selectedService?.id?.toString()
                    );
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
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Chọn thời gian
                    </h2>
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
                    error={errors.date}
                  />

                  <TimeSlotGrid
                    slots={
                      availableSlots?.slots
                        .filter(
                          (s) =>
                            new Date(s.start).getTime() > new Date().getTime()
                        )
                        .map((s) => ({
                          start: s.start,
                          end: s.end,
                          available: true,
                          scheduleId: s.scheduleId,
                        })) || []
                    }
                    selectedTime={startTime}
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

            {/* Step 4: Success */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircleIcon className="w-10 h-10 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Đặt lịch thành công!
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Chúng tôi đã ghi nhận lịch hẹn của bạn. Vui lòng kiểm tra
                    email để xem chi tiết.
                  </p>
                </div>

                {/* Appointment Summary */}
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4 text-center">
                    Thông tin lịch hẹn
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Chuyên khoa:</span>
                      <span className="font-medium text-gray-900">
                        {newAppointment?.schedule?.department?.name}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Dịch vụ:</span>
                      <span className="font-medium text-gray-900">
                        {newAppointment?.medicalService?.name}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Bác sĩ:</span>
                      <span className="font-medium text-gray-900">
                        {newAppointment?.doctor?.name ?? 'Hệ thống chọn'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Ngày khám:</span>
                      <span className="font-medium text-gray-900">
                        {newAppointment?.startTime
                          ? new Date(
                              newAppointment.startTime
                            ).toLocaleDateString('vi-VN', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : ''}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Giờ khám:</span>
                      <span className="font-semibold text-teal-600 text-lg">
                        {newAppointment?.startTime
                          ? formatTimeFromIso(newAppointment.startTime)
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Vui lòng đến đúng giờ hẹn. Nếu cần
                    thay đổi lịch, vui lòng liên hệ trước ít nhất 24 giờ.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Xác nhận thông tin
                    </h2>
                    <p className="text-sm text-gray-500">
                      Kiểm tra và xác nhận lịch hẹn của bạn
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-4 sm:p-6 space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Thông tin lịch hẹn
                  </h3>
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
                          ? new Date(appointmentDate).toLocaleDateString(
                              'vi-VN',
                              {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                              }
                            )
                          : 'Chưa chọn'}
                      </span>
                    </div>
                    <div className="flex justify-between sm:flex-col sm:col-span-2">
                      <span className="text-gray-500">Giờ khám</span>
                      <span className="font-medium text-teal-600 text-lg">
                        {formatTimeFromIso(startTime)}
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
                    value={watch('reason')}
                    onChange={(e) => setValue('reason', e.target.value)}
                    placeholder="Nhập triệu chứng (ví dụ: đau đầu, sốt cao 3 ngày...)"
                    rows={4}
                    className={`
                      w-full px-4 py-3 border rounded-xl resize-none
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                      transition-colors
                      ${errors.reason ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                    `}
                    aria-describedby={
                      errors.reason ? 'reason-error' : undefined
                    }
                    aria-invalid={errors.reason ? 'true' : 'false'}
                  />
                  {errors.reason && (
                    <p
                      id="reason-error"
                      className="text-sm text-red-600 flex items-center gap-1"
                    >
                      <span aria-hidden="true">⚠</span> {errors.reason.message}
                    </p>
                  )}
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Ghi chú (nếu có)
                  </label>
                  <textarea
                    id="notes"
                    value={watch('notes')}
                    onChange={(e) => setValue('notes', e.target.value)}
                    placeholder="Nhập ghi chú thêm ..."
                    rows={4}
                    className={`
                      w-full px-4 py-3 border rounded-xl resize-none
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                      transition-colors
                      ${errors.reason ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                    `}
                    aria-describedby={
                      errors.reason ? 'reason-error' : undefined
                    }
                    aria-invalid={errors.reason ? 'true' : 'false'}
                  />
                  {errors.notes && (
                    <p
                      id="reason-error"
                      className="text-sm text-red-600 flex items-center gap-1"
                    >
                      <span aria-hidden="true">⚠</span> {errors.notes.message}
                    </p>
                  )}
                </div>

                {/* Terms checkbox */}
                <div className="space-y-2">
                  {/* Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={watch('termsAccepted')}
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
          <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-between">
            {currentStep === 4 ? (
              // Step 4: Success - Show only home button
              <button
                type="button"
                onClick={onClose ? onClose : () => navigate('/')}
                className="w-full px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                QUAY LẠI TRANG CHỦ
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={currentStep === 1 ? onClose : handlePrevStep}
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
                        <svg
                          className="animate-spin w-5 h-5"
                          viewBox="0 0 24 24"
                        >
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
                        XÁC NHẬN ĐẶT LỊCH
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
