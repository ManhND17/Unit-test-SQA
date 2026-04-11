import React from 'react';
import Modal from '@src/components/Modal';
import {
  Hash,
  Building2,
  Phone,
  User,
  Users,
  MapPin,
  Calendar,
} from 'lucide-react';
import { IDepartment, DepartmentTypeLabels } from '@src/types';
interface DetailDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: IDepartment | null;
}
const typeColors = {
  clinical: 'bg-blue-100 text-blue-700',
  paraclinical: 'bg-purple-100 text-purple-700',
  administrative: 'bg-gray-100 text-gray-700',
};
export function DetailDepartmentModal({
  isOpen,
  onClose,
  department,
}: DetailDepartmentModalProps) {
  if (!department) return null;
  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-gray-600" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-500 mb-1">{label}</div>
        <div className="text-gray-900 font-medium">{value}</div>
      </div>
    </div>
  );

  return (
    <Modal open={isOpen} onClose={onClose} title="Chi tiết khoa">
      <div className="w-full max-w-3xl mx-auto max-h-[80vh] overflow-y-auto p-4">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-shrink-0">
              {department.thumbnail ? (
                <img
                  src={department.thumbnail}
                  alt="thumbnail"
                  className="w-36 h-24 object-cover rounded-md border"
                />
              ) : (
                <div className="w-36 h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                  Chưa có ảnh đại diện
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-2">Ảnh khác</div>
              <div className="flex gap-2 overflow-x-auto py-1">
                {((department.images ?? []) as string[])
                  .slice(0, 6)
                  .map((src, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 rounded-md overflow-hidden border"
                    >
                      <img
                        src={src}
                        alt={`dept-img-${i}`}
                        className="w-28 h-20 object-cover"
                      />
                    </div>
                  ))}

                {((department.images ?? []).length ?? 0) > 6 && (
                  <div className="flex-shrink-0 w-28 h-20 rounded-md bg-gray-100 flex items-center justify-center text-sm text-gray-600 border">
                    +{(department.images ?? []).length - 6} thêm
                  </div>
                )}

                {((department.images ?? []).length ?? 0) === 0 && (
                  <div className="text-sm text-gray-400">Chưa có ảnh</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <InfoRow icon={Hash} label="Mã khoa" value={department.code} />
            <InfoRow
              icon={Building2}
              label="Tên khoa"
              value={department.name}
            />
            <InfoRow
              icon={Building2}
              label="Loại khoa"
              value={
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[department.type]}`}
                >
                  {DepartmentTypeLabels[department.type]}
                </span>
              }
            />
            <InfoRow
              icon={Building2}
              label="Mô tả"
              value={<p className="text-gray-700">{department.description}</p>}
            />
            <InfoRow
              icon={Phone}
              label="Số điện thoại"
              value={department.phone || 'Chưa có'}
            />
            <InfoRow
              icon={User}
              label="Trưởng khoa"
              value={
                department.head ? (
                  <div>
                    <div>
                      {department.head.user?.name?.firstName}{' '}
                      {department.head.user?.name?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {department.head.user?.email}
                    </div>
                  </div>
                ) : (
                  'Chưa có'
                )
              }
            />
            <InfoRow
              icon={Users}
              label="Phó khoa"
              value={
                (department.deputies ?? []).length > 0 ? (
                  <div className="space-y-2">
                    {(department.deputies ?? []).map((deputy) => (
                      <div key={deputy.id}>
                        <div>
                          {deputy.staff?.user?.name?.firstName}{' '}
                          {deputy.staff?.user?.name?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {deputy.staff?.user?.email}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">Chưa có</span>
                )
              }
            />
            <InfoRow
              icon={MapPin}
              label="Phòng"
              value={
                department.room ? (
                  <div>
                    <div>{department.room.name}</div>
                    <div className="text-sm text-gray-500">
                      Tầng {department.room.floor} - Phòng{' '}
                      {department.room.number_room}
                    </div>
                  </div>
                ) : (
                  'Chưa gán'
                )
              }
            />
            <InfoRow
              icon={Calendar}
              label="Ngày tạo"
              value={new Date(department.createdAt).toLocaleDateString('vi-VN')}
            />
          </div>

          {/* Quick Stats - responsive layout */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-semibold text-blue-600">1</div>
              <div className="text-sm text-blue-700 mt-1">Trưởng khoa</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-semibold text-purple-600">
                {(department.deputies ?? []).length}
              </div>
              <div className="text-sm text-purple-700 mt-1">Phó khoa</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-semibold text-green-600">
                {department.room ? '1' : '0'}
              </div>
              <div className="text-sm text-green-700 mt-1">Phòng</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
