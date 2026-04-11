import {
  EUserGender,
  EVisitStatus,
  IDepartment,
  IDoctor,
  IMedicalService,
  IPatient,
  IUser,
} from '@src/types';
import CommonModal from '../Modal';
import AutoCompleteAutofill, { IValue } from '../AutoCompleteAutofill';
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';
import ApiDepartment from '@src/api/ApiDepartment';
import ApiMedicalService from '@src/api/ApiMedicalService';
import ApiDoctor from '@src/api/ApiDoctor';
import ApiPatient from '@src/api/ApiPatient';
import ApiVisit from '@src/api/ApiVisit';
import { QueryParam } from '@src/api/Fetcher';
import CommonSelect from '../CommonSelect';
import { clsx } from 'clsx';
import CommonInput from '../CommonInput';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import { IAutoFill } from '@src/api/ApiAutofill';
import { PatientFormModal } from '@src/pages/Admin/PatientManagement/components/AddEditPatient';
import ApiAdminUser from '@src/api/ApiAdminUser';

export interface IVisitFormValues {
  appointmentId: string;
  patient: IPatient | null;
  medicalService: IMedicalService | null;
  department: IDepartment | null;
  reason: string;
  doctor: IDoctor | null;
  startTime: string;
  ehrId: string;
  type?: string;
}

interface IModalAddEditVisitProps {
  initValues?: Partial<IVisitFormValues>;
  onSubmit?: () => void;
  onClose: () => void;
  isEditMode?: boolean;
  isOpen: boolean;
}

export default function ModalAddEditVisit({
  initValues = {},
  onSubmit,
  onClose,
  isEditMode = false,
  isOpen,
}: IModalAddEditVisitProps) {
  const [isOpenFormPatient, setIsOpenFormPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<IAutoFill | null>(
    initValues.patient
      ? {
          id: initValues.patient.userId,
          name: initValues.patient.user?.name
            ? `${initValues.patient.user.name.firstName || ''} ${initValues.patient.user.name.lastName || ''}`
            : initValues.patient.patientId,
          avatar: initValues.patient.user?.avatar,
        }
      : null
  );
  const [doctor, setDoctor] = useState<Partial<IDoctor> | null>(
    initValues.doctor || null
  );
  const [medicalService, setMedicalService] =
    useState<Partial<IMedicalService> | null>(
      initValues.medicalService || null
    );
  const [department, setDepartment] = useState<Partial<IDepartment> | null>(
    initValues.department || null
  );
  const [reason, setReason] = useState<string>(initValues.reason || '');
  const [type, setType] = useState<string>(initValues.type || 'new');
  const [startTime, setStartTime] = useState<string>(
    initValues.startTime || ''
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper function to convert ISO string to datetime-local format
  const convertToDateTimeLocal = (isoString: string | undefined) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      // Format: YYYY-MM-DDTHH:mm
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  const handleSubmitFormPatient = useCallback(
    async (formData: Partial<IUser>) => {
      // Create new patient
      const newStaff: any = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        birthday: formData.birthday,
        gender: formData.gender || EUserGender.MALE,
        phone: formData.phone,
        name: {
          firstName: formData.name?.firstName,
          lastName: formData.name?.lastName,
        },
        address: {
          detail: formData.address?.detail,
          city: formData.address?.city,
          district: formData.address?.district,
          ward: formData.address?.ward,
          country: 'Vietnam',
        },
      };
      try {
        await ApiAdminUser.createPatient(newStaff);
        toast.success('Thêm bệnh nhân mới thành công');
        setIsOpenFormPatient(false);
      } catch (error) {
        toast.error('Đã có lỗi xảy ra khi thêm bệnh nhân mới');
      }
    },
    []
  );

  // Update states when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (initValues.patient) {
      setSelectedPatient({
        id: initValues.patient.userId,
        name: initValues.patient.user?.name
          ? `${initValues.patient.user.name.firstName || ''} ${initValues.patient.user.name.lastName || ''}`
          : initValues.patient.patientId,
        avatar: initValues.patient.user?.avatar,
      });
    } else {
      setSelectedPatient(null);
    }

    setDoctor(initValues.doctor || null);
    setMedicalService(initValues.medicalService || null);
    setDepartment(initValues.department || null);
    setReason(initValues.reason || '');
    setStartTime(convertToDateTimeLocal(initValues.startTime));
    setErrors({});
  }, [isOpen]);

  const { data: departmentsResponse } = useQuery({
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

  const departments = departmentsResponse?.departments || [];

  const { data: medicalServicesResponse } = useQuery({
    queryKey: [
      QUERY_KEY.MEDICAL_SERVICE.GET_LIST_MEDICAL_SERVICE,
      department?.id,
    ],
    queryFn: () =>
      ApiMedicalService.getMedicalServices({
        isActive: 1,
        departmentId: department?.id as number,
      }),
    enabled: !!department?.id,
  });

  const medicalServices = medicalServicesResponse?.data || [];

  const { data: doctorsResponse } = useQuery({
    queryKey: [
      QUERY_KEY.DOCTOR.GET_LIST_DOCTOR,
      department?.id,
      medicalService?.id,
    ],
    queryFn: () =>
      ApiDoctor.getDoctors({
        departmentId: department?.id,
        medicalServiceId: medicalService?.id,
      }),
    enabled: !!department?.id,
  });

  const doctors = doctorsResponse?.data || [];

  const getListPatients = async (params: QueryParam) => {
    const res = await ApiPatient.getPatients(params);
    return {
      ...res,
      data: res.data.map((patient) => ({
        id: patient.userId,
        name: patient.user?.name
          ? `${patient.user.name.firstName || ''} ${patient.user.name.lastName || ''}`
          : patient.patientId,
        avatar: patient.user?.avatar,
      })),
    };
  };

  const createVisitMutation = useMutation({
    mutationFn: ApiVisit.createVisit,
    onSuccess: () => {
      toast.success('Tạo lượt khám thành công!');
      onSubmit?.();
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Có lỗi xảy ra khi tạo lượt khám'
      );
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!initValues.patient && !selectedPatient) {
      newErrors.patient = 'Vui lòng chọn bệnh nhân';
    }
    if (!department) {
      newErrors.department = 'Vui lòng chọn chuyên khoa';
    }
    if (!medicalService) {
      newErrors.medicalService = 'Vui lòng chọn dịch vụ y tế';
    }
    if (!reason.trim()) {
      newErrors.reason = 'Vui lòng nhập lý do khám';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const patientUserId = selectedPatient
      ? selectedPatient.id
      : initValues.patient
        ? initValues.patient.userId
        : '';

    if (!patientUserId) {
      toast.error('Không tìm thấy thông tin bệnh nhân');
      return;
    }

    createVisitMutation.mutate({
      medicalServiceId: medicalService?.id,
      doctorId: doctor?.userId,
      startTime: startTime || undefined,
      appointmentId: initValues.appointmentId,
      patientUserId,
      status: EVisitStatus.WAITING,
      type,
    });
  };

  return (
    <>
      <CommonModal
        open={isOpen}
        onClose={onClose}
        title={isEditMode ? 'Chỉnh sửa lượt khám' : 'Tạo lượt khám mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bệnh nhân <span className="text-red-500">*</span>
            </label>
            <AutoCompleteAutofill
              multiple={false}
              placeHolder="Nhập tên hoặc mã bệnh nhân..."
              name="autofillPatient"
              suggestionAPI={getListPatients}
              value={
                selectedPatient
                  ? ({
                      id: selectedPatient.id,
                      label: selectedPatient.name,
                      avatar: selectedPatient.avatar,
                    } as IValue)
                  : undefined
              }
              disabled={!!initValues.patient}
              onChange={(val) => {
                if (!val) {
                  setSelectedPatient(null);
                  return;
                }
                if (Array.isArray(val)) {
                  const first = val[0];
                  if (!first) {
                    setSelectedPatient(null);
                    return;
                  }
                  setSelectedPatient(first as IValue);
                  return;
                }
                if (typeof val === 'string') {
                  setSelectedPatient({ id: val, name: val });
                  return;
                }
                setSelectedPatient(val as IValue);
              }}
              renderOption={(props, option: IValue) => {
                const isSelected = selectedPatient?.id === option.id;
                return (
                  <li
                    {...props}
                    className={clsx(
                      'w-full p-2 hover:cursor-pointer hover:bg-gray-100 transition-colors',
                      {
                        'bg-blue-50 hover:bg-blue-100': isSelected,
                      }
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={option.avatar || '/images/default-avatar.jpg'}
                        alt={option.label}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="truncate text-gray-900">
                        {option.label}
                      </span>
                    </div>
                  </li>
                );
              }}
              fallbackThumbnail="/images/default-avatar.jpg"
            />
            {errors.patient && (
              <p className="mt-1 text-xs text-red-500">{errors.patient}</p>
            )}
          </div>
          {!initValues.patient && (
            <div
              className="mt-1 text-xs text-blue-600 cursor-pointer hover:underline"
              onClick={() => setIsOpenFormPatient(true)}
            >
              + Thêm bệnh nhân mới
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chuyên khoa <span className="text-red-500">*</span>
            </label>
            <CommonSelect
              values={departments.map((dept) => ({
                id: dept.id + '',
                name: dept.name,
              }))}
              value={department ? department.id + '' : ''}
              onChange={(value) => {
                const selectedDept = departments.find(
                  (dept) => dept.id + '' === value
                );
                setDepartment(selectedDept || null);
                setMedicalService(null);
                setDoctor(null);
              }}
              className="w-full"
              placeholder="Chọn chuyên khoa"
            />
            {errors.department && (
              <p className="mt-1 text-xs text-red-500">{errors.department}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dịch vụ y tế <span className="text-red-500">*</span>
            </label>
            <CommonSelect
              values={medicalServices.map((service) => ({
                id: service.id,
                name: service.name,
              }))}
              value={medicalService ? medicalService.id : ''}
              onChange={(value) => {
                const selectedService = medicalServices.find(
                  (service) => service.id === value
                );
                setMedicalService(selectedService || null);
                setDoctor(null);
              }}
              className="w-full"
              placeholder="Chọn dịch vụ y tế"
            />
            {errors.medicalService && (
              <p className="mt-1 text-xs text-red-500">
                {errors.medicalService}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại khám bệnh
            </label>
            <CommonSelect
              values={[
                { id: 'new', name: 'Khám mới' },
                { id: 'follow-up', name: 'Khám lại' },
                { id: 'checkUp', name: 'Khám tổng quát' },
                { id: 'consultation', name: 'Tư vấn' },
                { id: 'telehealth', name: 'Khám từ xa' },
              ]}
              value={type}
              onChange={(value) => setType(value)}
              className="w-full"
              placeholder="Chọn loại khám bệnh"
            />
            {errors.type && (
              <p className="mt-1 text-xs text-red-500">{errors.type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bác sĩ chỉ định (Tùy chọn)
            </label>
            <CommonSelect
              values={doctors.map((doc) => ({
                id: doc?.user?.id || '',
                name: doc.user?.name
                  ? `${doc.user.name.firstName} ${doc.user.name.lastName}`
                  : doc.userId,
              }))}
              value={doctor ? doctor?.user?.id || doctor?.userId : ''}
              onChange={(value) => {
                const selectedDoctor = doctors.find(
                  (doc) => doc?.user?.id === value || doc?.userId === value
                );
                setDoctor(selectedDoctor || null);
              }}
              className="w-full"
              placeholder="Chọn bác sĩ"
            />
          </div>

          <div>
            <CommonInput
              label="Lý do khám"
              placeholder="Mô tả triệu chứng, lý do đến khám..."
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={!!errors.reason}
            />
            {errors.reason && (
              <p className="mt-1 text-xs text-red-500">{errors.reason}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            {errors.startTime && (
              <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={onClose} variant="outlined">
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createVisitMutation.isPending}
            >
              {createVisitMutation.isPending
                ? 'Đang xử lý...'
                : isEditMode
                  ? 'Lưu thay đổi'
                  : 'Tạo lượt khám'}
            </Button>
          </div>
        </form>
      </CommonModal>
      <PatientFormModal
        isOpen={isOpenFormPatient}
        onClose={() => setIsOpenFormPatient(false)}
        onSubmit={handleSubmitFormPatient}
      />
    </>
  );
}
