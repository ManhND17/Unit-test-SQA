import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { IUser, UserGenderLabels } from '@src/types';
import Modal from '@src/components/Modal';
import { FileText, MapPin, User as UserIcon, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import ApiEHR from '@src/api/ApiEHR';
import { EHRModal } from './EHRModal';

interface ViewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: IUser;
}

export function ViewPatientModal({
  isOpen,
  onClose,
  patient,
}: ViewPatientModalProps) {
  const [isEHRModalOpen, setIsEHRModalOpen] = useState(false);
  const [ehrId, setEhrId] = useState<string | null>(
    patient?.patient?.ehr?.id || null
  );

  useEffect(() => {
    if (isOpen) {
      setEhrId(patient?.patient?.ehr?.id || null);
    }
  }, [isOpen, patient?.patient?.ehr?.id]);

  const ehrData = useQuery({
    queryKey: ['getEHR', ehrId],
    queryFn: async () => {
      return ApiEHR.getEhrById(ehrId as string);
    },
    enabled: !!ehrId,
  });

  const createEHRMutation = useMutation({
    mutationFn: (patientId: string) => ApiEHR.createEHR(patientId),
    onSuccess: (data) => {
      toast.success('Tạo hồ sơ sức khỏe điện tử thành công!');
      setEhrId(data.id);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Lỗi khi tạo hồ sơ sức khỏe điện tử');
    },
  });

  const handleCreateEHR = async () => {
    if (!patient?.id) return;
    createEHRMutation.mutate(patient.id);
  };

  if (!patient) return null;
  const ehr = ehrData.data;

  return (
    <>
      <Modal open={isOpen} onClose={onClose} title="Chi tiết bệnh nhân">
        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          <div className="flex justify-center">
            <img
              src={patient.avatar}
              alt={patient.username}
              className="h-20 w-20 rounded-full object-cover border-3 border-green-100"
            />
          </div>

          {/* Basic Information */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <UserIcon size={16} className="text-green-600" />
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoBox label="Tên bệnh nhân" value={patient.username} />
              <InfoBox
                label="ID Bệnh nhân"
                value={patient.patient?.patientId || '-'}
                highlight
              />
              <InfoBox label="Email" value={patient.email} />
              <InfoBox label="Số điện thoại" value={patient.phone || '-'} />
              <InfoBox
                label="Ngày sinh"
                value={
                  patient.birthday
                    ? new Date(patient.birthday).toLocaleDateString('vi-VN')
                    : '-'
                }
              />
              <InfoBox
                label="Giới tính"
                value={UserGenderLabels[patient.gender]}
              />
            </div>
          </div>

          {/* Name Information */}
          {patient.name && (
            <div className="border-b pb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UserIcon size={16} className="text-blue-600" />
                Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoBox label="Họ" value={patient.name.firstName} />
                <InfoBox label="Tên" value={patient.name.lastName} />
              </div>
            </div>
          )}

          {/* Address Information */}
          {patient.address && (
            <div className="border-b pb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-red-600" />
                Địa chỉ
              </h3>
              <div className="space-y-2 text-sm">
                {patient.address.detail && (
                  <InfoBox
                    label="Địa chỉ chi tiết"
                    value={patient.address.detail}
                  />
                )}
                <div className="grid grid-cols-2 gap-3">
                  {patient.address.ward && (
                    <InfoBox label="Phường/Xã" value={patient.address.ward} />
                  )}
                  {patient.address.city && (
                    <InfoBox
                      label="Tỉnh/Thành phố"
                      value={patient.address.city}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Dates Information */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Thông tin hệ thống
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoBox
                label="Ngày đăng ký"
                value={new Date(patient.createdAt).toLocaleDateString('vi-VN')}
              />
              <InfoBox
                label="Cập nhật lần cuối"
                value={new Date(patient.updatedAt).toLocaleDateString('vi-VN')}
              />
            </div>
          </div>

          {/* EHR Section */}
          {ehr ? (
            <div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Hồ sơ sức khỏe điện tử
                      </h4>
                      <p className="text-xs text-gray-600">
                        {ehr?.visits?.length || 0} lần khám bệnh
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEHRModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <FileText size={16} />
                    Xem EHR
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText size={28} className="text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  Chưa có hồ sơ sức khỏe điện tử
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  Tạo hồ sơ sức khỏe điện tử để bắt đầu theo dõi lịch sử khám
                  bệnh
                </p>
                <button
                  onClick={handleCreateEHR}
                  disabled={createEHRMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createEHRMutation.isPending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Tạo hồ sơ sức khỏe
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
      {ehr && (
        <EHRModal
          isOpen={isEHRModalOpen}
          onClose={() => setIsEHRModalOpen(false)}
          ehr={ehr}
        />
      )}
    </>
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
      className={`rounded-lg p-3 ${highlight ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}
    >
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-base font-semibold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}
