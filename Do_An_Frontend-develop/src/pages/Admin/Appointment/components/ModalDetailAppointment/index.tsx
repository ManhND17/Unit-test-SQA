import CommonModal from '@src/components/Modal';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  FileTextIcon,
  StethoscopeIcon,
  BuildingIcon,
  BanIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  DoorOpenIcon,
} from 'lucide-react';
import { formatTimeFromIso } from '@src/utils/datetime';

type AppointmentResponseDto = {
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

interface ModalDetailAppointmentProps {
  open: boolean;
  onClose: () => void;
  appointment: AppointmentResponseDto | null;
}

const statusConfig = {
  pending: {
    label: 'Chờ xác nhận',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertCircleIcon,
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircleIcon,
  },
  completed: {
    label: 'Đã hoàn thành',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircleIcon,
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircleIcon,
  },
  rejected: {
    label: 'Đã từ chối',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircleIcon,
  },
};

const appointmentTypeConfig = {
  new: 'Khám mới',
  followUp: 'Tái khám',
  checkUp: 'Khám định kỳ',
  consultation: 'Tư vấn',
  telehealth: 'Khám từ xa',
};

export default function ModalDetailAppointment({
  open,
  onClose,
  appointment,
}: ModalDetailAppointmentProps) {
  if (!appointment) return null;

  const status = statusConfig[
    appointment.status as keyof typeof statusConfig
  ] || {
    label: appointment.status,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: AlertCircleIcon,
  };

  const StatusIcon = status.icon;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Chi tiết lịch hẹn"
      customStyle={{
        width: { xs: '95%', sm: '90%', md: '800px', lg: '900px' },
        maxHeight: '90vh',
        overflow: 'auto',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold ${status.color}`}
          >
            <StatusIcon className="w-5 h-5" />
            {status.label}
          </div>
          <span className="text-sm text-gray-500">
            Mã:{' '}
            <span className="font-mono font-semibold">{appointment.id}</span>
          </span>
        </div>

        {/* Patient Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" />
            Thông tin bệnh nhân
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              {appointment.patient.avatar ? (
                <img
                  src={appointment.patient.avatar}
                  alt={appointment.patient.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                  {appointment.patient.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {appointment.patient.name}
                </p>
                <p className="text-sm text-gray-600">
                  BN: {appointment.patient.patientId}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {appointment.patient.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <PhoneIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">
                    {appointment.patient.phone}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <MailIcon className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 truncate">
                  {appointment.patient.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-teal-600" />
            Thông tin lịch hẹn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={<CalendarIcon className="w-4 h-4" />}
              label="Ngày khám"
              value={formatDateTime(appointment.startTime)}
            />
            <InfoItem
              icon={<ClockIcon className="w-4 h-4" />}
              label="Giờ khám"
              value={formatTimeFromIso(appointment.startTime)}
            />
            <InfoItem
              icon={<FileTextIcon className="w-4 h-4" />}
              label="Loại lịch hẹn"
              value={
                appointmentTypeConfig[
                  appointment.type as keyof typeof appointmentTypeConfig
                ] || appointment.type
              }
            />
            <InfoItem
              icon={<ClockIcon className="w-4 h-4" />}
              label="Thời gian khám"
              value={`${appointment.medicalService.durationMinutes} phút`}
            />
          </div>
        </div>

        {/* Medical Service & Department */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <StethoscopeIcon className="w-5 h-5 text-teal-600" />
            Dịch vụ & Chuyên khoa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={<BuildingIcon className="w-4 h-4" />}
              label="Chuyên khoa"
              value={appointment?.department?.name || 'N/A'}
            />
            <InfoItem
              icon={<StethoscopeIcon className="w-4 h-4" />}
              label="Dịch vụ khám"
              value={appointment.medicalService.name}
            />
            <InfoItem
              icon={<UserIcon className="w-4 h-4" />}
              label="Bác sĩ"
              value={`${appointment.doctor.level}. ${appointment.doctor.name}`}
            />
            <InfoItem
              icon={<FileTextIcon className="w-4 h-4" />}
              label="Chuyên môn"
              value={appointment.doctor.specialization}
            />
            {appointment.schedule?.room && (
              <InfoItem
                icon={<DoorOpenIcon className="w-4 h-4" />}
                label="Phòng khám"
                value={appointment.schedule.room}
              />
            )}
            <InfoItem
              icon={<FileTextIcon className="w-4 h-4" />}
              label="Chi phí"
              value={formatCurrency(appointment.medicalService.price)}
              valueClassName="font-bold text-teal-600"
            />
          </div>
        </div>

        {/* Reason & Notes */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileTextIcon className="w-4 h-4 text-gray-600" />
              Lý do khám
            </h4>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
              {appointment.reason}
            </p>
          </div>

          {appointment.notes && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileTextIcon className="w-4 h-4 text-gray-600" />
                Ghi chú
              </h4>
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                {appointment.notes}
              </p>
            </div>
          )}

          {appointment.reasonCancel && (
            <div>
              <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <BanIcon className="w-4 h-4" />
                Lý do hủy
              </h4>
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {appointment.reasonCancel}
              </p>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ngày tạo:</span>
            <span className="text-gray-900 font-medium">
              {new Date(appointment.createdAt).toLocaleString('vi-VN')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Cập nhật lần cuối:</span>
            <span className="text-gray-900 font-medium">
              {new Date(appointment.updatedAt).toLocaleString('vi-VN')}
            </span>
          </div>
          {appointment.bookedBy && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Đặt bởi:</span>
              <span className="text-gray-900 font-medium">
                {appointment.bookedBy.name}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border-[1px] border-black text-black font-semibold hover:bg-black hover:text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </CommonModal>
  );
}

// Helper Component for Info Items
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}

function InfoItem({ icon, label, value, valueClassName = '' }: InfoItemProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-gray-500 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-600 mb-0.5">{label}</p>
        <p className={`text-sm font-medium text-gray-900 ${valueClassName}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
