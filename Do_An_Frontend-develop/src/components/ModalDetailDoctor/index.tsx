import CommonModal from '@components/Modal';
import { useNavigate } from 'react-router-dom';
import { IDoctor } from '@src/types';
import {
  Mail,
  Phone,
  Award,
  Briefcase,
  Calendar,
  Star,
  MapPin,
} from 'lucide-react';
import clsx from 'clsx';

interface IDoctorDetail extends IDoctor {
  rating?: number;
  isAvailable?: boolean;
}

interface ModalDetailDoctorProps {
  open: boolean;
  onClose: () => void;
  doctor?: IDoctorDetail | null;
}

export default function ModalDetailDoctor({
  open,
  onClose,
  doctor,
}: ModalDetailDoctorProps) {
  const navigate = useNavigate();
  if (!doctor) return null;

  const fullName =
    `${doctor.level || ''} ${doctor.user?.name?.firstName || ''} ${doctor.user?.name?.lastName || ''}`.trim();
  const joinDate = doctor.staff?.joinTime
    ? new Date(doctor.staff.joinTime).toLocaleDateString('vi-VN')
    : 'Chưa có thông tin';

  const handleBookAppointment = () => {
    navigate(
      `/patient/create-appointment?doctorId=${doctor.user?.id || ''}&departmentId=${doctor.staff?.department?.id || ''}`
    );
    onClose();
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Thông tin chi tiết bác sĩ"
      customStyle={{
        maxHeight: '90vh',
        overflow: 'auto',
      }}
    >
      <div className="space-y-6">
        {/* Avatar và thông tin cơ bản */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <img
              src={doctor.user?.avatar || '/images/default-avatar.jpg'}
              alt={fullName}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{fullName}</h3>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Briefcase size={16} />
                {doctor.staff?.position || 'Bác sĩ'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  doctor.isAvailable
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {doctor.isAvailable ? 'Đang hoạt động' : 'Không hoạt động'}
              </div>
              {doctor.rating !== undefined && (
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {doctor.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Thông tin liên hệ */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-800">
            Thông tin liên hệ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctor.user?.email && (
              <div className="flex items-center gap-3 text-gray-700">
                <Mail size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{doctor.user.email}</p>
                </div>
              </div>
            )}
            {doctor.user?.phone && (
              <div className="flex items-center gap-3 text-gray-700">
                <Phone size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium">{doctor.user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Thông tin chuyên môn */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-800">
            Thông tin chuyên môn
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctor.staff?.department && (
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Khoa</p>
                  <p className="font-medium">{doctor.staff.department.name}</p>
                  <p className="text-xs text-gray-400">
                    Mã: {doctor.staff.department.code}
                  </p>
                </div>
              </div>
            )}
            {doctor.specialization && (
              <div className="flex items-center gap-3 text-gray-700">
                <Award size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Chuyên khoa</p>
                  <p className="font-medium">{doctor.specialization}</p>
                </div>
              </div>
            )}
            {doctor.experienceYears !== undefined && (
              <div className="flex items-center gap-3 text-gray-700">
                <Briefcase size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Kinh nghiệm</p>
                  <p className="font-medium">{doctor.experienceYears} năm</p>
                </div>
              </div>
            )}
            {doctor.licenseNumber && (
              <div className="flex items-center gap-3 text-gray-700">
                <Award size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">
                    Số giấy phép hành nghề
                  </p>
                  <p className="font-medium">{doctor.licenseNumber}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Thông tin khác */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-800">
            Thông tin khác
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctor.staff?.staffId && (
              <div className="flex items-center gap-3 text-gray-700">
                <div>
                  <p className="text-sm text-gray-500">Mã nhân viên</p>
                  <p className="font-medium">{doctor.staff.staffId}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Ngày vào làm</p>
                <p className="font-medium">{joinDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Đóng
          </button>
          <button
            className={clsx(
              'px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium',
              {
                'opacity-50 cursor-not-allowed': !doctor.isAvailable,
              }
            )}
            onClick={() => {
              handleBookAppointment();
              onClose();
            }}
            disabled={!doctor.isAvailable}
          >
            Đặt lịch khám
          </button>
        </div>
      </div>
    </CommonModal>
  );
}
