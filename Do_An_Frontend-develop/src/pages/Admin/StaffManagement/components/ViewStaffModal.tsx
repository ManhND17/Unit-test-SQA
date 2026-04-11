import React from 'react';
import { IUser, UserRoleLabels, UserGenderLabels } from '@src/types';
import Modal from '@src/components/Modal';
import {
  Heart,
  MapPin,
  Award,
  FileText,
  Phone,
  Mail,
  Clock,
  User as UserIcon,
} from 'lucide-react';
import { formatDateTimeFromIso } from '@src/utils/datetime';

interface ViewStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: IUser;
}

function DoctorDetail({ staff }: { staff: IUser }) {
  const doctorInfo = staff.staff?.doctor;
  const staffInfo = staff.staff;
  const displayName =
    (staff.name && `${staff.name.firstName} ${staff.name.lastName}`.trim()) ||
    staff.username;

  return (
    <div className="space-y-4">
      {/* Hero Card with Avatar & Status */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={staff.avatar}
              alt={staff.username}
              className="h-16 w-16 rounded-full object-cover border-3 border-white shadow-sm"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900">{displayName}</h2>
              <p className="text-sm text-gray-600 mt-0.5">
                {doctorInfo?.specialization}
              </p>
              {staffInfo?.position && (
                <p className="text-md text-gray-500 mt-0.5 font-medium">
                  {staffInfo.position}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Specialization & ID Chips */}
      <div className="flex flex-wrap gap-2">
        <div className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-md font-medium flex items-center gap-1">
          <Award size={14} />
          {doctorInfo?.specialization || '-'}
        </div>
        {doctorInfo?.licenseNumber && (
          <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-md font-medium flex items-center gap-1">
            <FileText size={14} />
            {doctorInfo.licenseNumber}
          </div>
        )}
        <div className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-md font-medium">
          {doctorInfo?.level || '-'}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard
          label="Kinh nghiệm"
          value={`${doctorInfo?.experienceYears || 0} năm`}
          icon={<Clock size={16} className="text-blue-600" />}
        />
        <StatCard
          label="Cấp bậc"
          value={doctorInfo?.level || '-'}
          icon={<Award size={16} className="text-purple-600" />}
        />
        <StatCard
          label="Đánh giá"
          value={`${doctorInfo?.licenseNumber || 0}/5`}
          icon={<Heart size={16} className="text-red-600" />}
        />
        <StatCard
          label="Vào làm"
          value={
            staffInfo?.joinTime
              ? new Date(staffInfo.joinTime).toLocaleDateString('vi-VN', {
                  month: '2-digit',
                  day: '2-digit',
                })
              : '-'
          }
          icon={<Clock size={16} className="text-green-600" />}
        />
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg p-3.5 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-1.5">
          <UserIcon size={16} className="text-indigo-600" />
          Thông tin cá nhân
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <InfoBox label="Họ" value={staff.name?.firstName || '-'} />
          <InfoBox label="Tên" value={staff.name?.lastName || '-'} />
          <InfoBox label="Email" value={staff.email || '-'} />
          <InfoBox label="SĐT" value={staff.phone || '-'} />
          <InfoBox label="Giới tính" value={UserGenderLabels[staff.gender]} />
        </div>
      </div>

      {/* Address */}
      {staff.address && (
        <div className="bg-white rounded-lg p-3.5 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-1.5">
            <MapPin size={16} className="text-red-600" />
            Địa chỉ
          </h3>
          <div className="space-y-2 text-sm">
            {staff.address.detail && (
              <InfoBox label="Địa chỉ chi tiết" value={staff.address.detail} />
            )}
            <div className="grid grid-cols-2 gap-2">
              <InfoBox label="Phường/Xã" value={staff.address.ward || '-'} />
              <InfoBox
                label="Tỉnh/Thành phố"
                value={staff.address.city || '-'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-1.5">
          <Phone size={16} className="text-blue-600" />
          Liên hệ
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-700 break-all">{staff.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-700">{staff.phone || '-'}</span>
          </div>
        </div>
      </div>

      {/* Department Card */}
      {staffInfo?.department && (
        <div className="bg-indigo-50 rounded-lg p-3.5 border border-indigo-200">
          <h3 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-1.5">
            <MapPin size={16} className="text-indigo-600" />
            Phòng ban
          </h3>
          <p className="text-base font-bold text-indigo-900">
            {staffInfo.department.name}
          </p>
          <p className="text-md text-indigo-600 mt-0.5">
            Mã: {staffInfo.department.code}
          </p>
        </div>
      )}

      {/* License & Certificate Card */}
      <div className="bg-green-50 rounded-lg p-3.5 border border-green-200">
        <h3 className="text-sm font-semibold text-green-900 mb-2.5 flex items-center gap-1.5">
          <FileText size={16} className="text-green-600" />
          Chứng chỉ & Giấy phép
        </h3>
        <div className="space-y-2 text-sm">
          {doctorInfo?.licenseNumber && (
            <div>
              <span className="text-gray-600">Giấy phép:</span>
              <p className="font-mono font-semibold text-green-700 text-md">
                {doctorInfo.licenseNumber}
              </p>
            </div>
          )}
          <div>
            <span className="text-gray-600">Chuyên khoa:</span>
            <p className="font-semibold text-green-700 text-md">
              {doctorInfo?.specialization || '-'}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Cấp bậc:</span>
            <p className="font-semibold text-green-700 text-md">
              {doctorInfo?.level || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="border-t pt-3.5">
        <p className="text-md font-semibold text-gray-500 uppercase tracking-wide mb-2.5">
          Hệ thống
        </p>
        <div className="grid grid-cols-2 gap-2.5 text-md">
          <div className="bg-gray-50 p-2.5 rounded">
            <span className="text-gray-600 text-md">ID Nhân viên:</span>
            <p className="font-mono font-semibold text-gray-900 text-md mt-1">
              {staffInfo?.staffId || staff.id}
            </p>
          </div>
          <div className="bg-gray-50 p-2.5 rounded">
            <span className="text-gray-600 text-md">User ID:</span>
            <p className="font-mono font-semibold text-gray-900 text-md mt-1">
              {staff.id}
            </p>
          </div>
          <div className="bg-gray-50 p-2.5 rounded">
            <span className="text-gray-600 text-md">Cập nhật:</span>
            <p className="font-semibold text-gray-900 text-md mt-1">
              {formatDateTimeFromIso(staff.updatedAt)}
            </p>
          </div>
          <div className="bg-gray-50 p-2.5 rounded">
            <span className="text-gray-600 text-md">Giới tính:</span>
            <p className="font-semibold text-gray-900 text-md mt-1">
              {UserGenderLabels[staff.gender]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DefaultStaffDetail({ staff }: { staff: IUser }) {
  const displayName =
    (staff.name && `${staff.name.firstName} ${staff.name.lastName}`.trim()) ||
    staff.username;
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <img
          src={staff.avatar}
          alt={staff.username}
          className="h-28 w-28 rounded-full object-cover border-4 border-blue-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InfoBox
          label="Họ"
          value={staff.name?.firstName || displayName.split(' ')?.[0] || '-'}
        />
        <InfoBox
          label="Tên"
          value={
            staff.name?.lastName ||
            displayName.split(' ').slice(1).join(' ') ||
            '-'
          }
        />
        <InfoBox label="Email" value={staff.email || '-'} />
        <InfoBox label="SĐT" value={staff.phone || '-'} />
        <InfoBox label="Giới tính" value={UserGenderLabels[staff.gender]} />
        <InfoBox
          label="Vai trò"
          value={UserRoleLabels[staff.role.name as keyof typeof UserRoleLabels]}
          highlight
        />
        <InfoBox
          label="Ngày tham gia"
          value={new Date(staff.createdAt).toLocaleDateString('vi-VN')}
        />
      </div>

      {staff.address && (
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
            <MapPin size={16} className="text-red-600" />
            Địa chỉ
          </h3>
          <div className="space-y-2 text-sm">
            {staff.address.detail && (
              <InfoBox label="Địa chỉ chi tiết" value={staff.address.detail} />
            )}
            <div className="grid grid-cols-2 gap-2">
              <InfoBox label="Phường/Xã" value={staff.address.ward || '-'} />
              <InfoBox
                label="Tỉnh/Thành phố"
                value={staff.address.city || '-'}
              />
            </div>
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <p className="text-md font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Thông tin khác
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <span className="text-gray-600 text-md">Cập nhật:</span>
            <p className="font-medium text-gray-900 text-md mt-1">
              {new Date(staff.updatedAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="text-gray-600 text-md">ID:</span>
            <p className="font-mono font-medium text-gray-900 text-md mt-1">
              {staff.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <p className="text-md text-gray-600 font-medium">{label}</p>
        {icon}
      </div>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}

function InfoBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-3 ${highlight ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}
    >
      <p className="text-md font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

export function ViewStaffModal({
  isOpen,
  onClose,
  staff,
}: ViewStaffModalProps) {
  if (!staff) return null;

  const isDoctor = staff.role.name === 'doctor';

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={isDoctor ? 'Thông tin bác sĩ' : 'Chi tiết nhân viên'}
    >
      <div className="max-h-[80vh] overflow-y-auto pr-2">
        {isDoctor ? (
          <DoctorDetail staff={staff} />
        ) : (
          <DefaultStaffDetail staff={staff} />
        )}
      </div>
    </Modal>
  );
}
