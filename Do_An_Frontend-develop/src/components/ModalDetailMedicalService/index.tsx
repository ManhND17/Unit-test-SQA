import CommonModal from '@components/Modal';
import { IMedicalService } from '@src/types';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  DollarSign,
  MapPin,
  Activity,
  Calendar,
  Shield,
  TrendingUp,
} from 'lucide-react';

interface IMedicalServiceDetail extends IMedicalService {
  hasInsuranceSupport: boolean;
  _count?: {
    serviceUsage: number;
  };
  isPopular?: boolean;
  priceFormatted?: string;
}

interface ModalDetailMedicalServiceProps {
  open: boolean;
  onClose: () => void;
  service?: IMedicalServiceDetail | null;
}

export default function ModalDetailMedicalService({
  open,
  onClose,
  service,
}: ModalDetailMedicalServiceProps) {
  const navigate = useNavigate();
  if (!service) return null;

  const handleRegisterService = () => {
    navigate(
      `/patient/create-appointment?medicalServiceId=${service.id}&departmentId=${service.department?.id || ''}`
    );
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const insuranceAmount = service.percentApplyHealthInsurance
    ? (service.price * service.percentApplyHealthInsurance) / 100
    : 0;

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Thông tin chi tiết dịch vụ"
      customStyle={{
        maxHeight: '90vh',
        overflow: 'auto',
        width: {
          xs: '90%',
          lg: '900px',
        },
      }}
    >
      <div className="space-y-6">
        {/* Hình ảnh dịch vụ */}
        {service.images && service.images.length > 0 && (
          <div className="w-full">
            <img
              src={service.images[0]}
              alt={service.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Tên và trạng thái */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-bold text-gray-800 flex-1">
              {service.name}
            </h3>
            <div className="flex gap-2 flex-wrap">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                  service.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {service.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
              </div>
              {service.isPopular && (
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 whitespace-nowrap">
                  <TrendingUp size={14} className="inline mr-1" />
                  Phổ biến
                </div>
              )}
            </div>
          </div>
          {service.description && (
            <p className="text-gray-600 leading-relaxed">
              {service.description}
            </p>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Thông tin giá và thời gian */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-800">
            Thông tin dịch vụ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-gray-700 bg-blue-50 p-4 rounded-lg">
              <DollarSign size={24} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Giá dịch vụ</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatPrice(service.price)}
                </p>
                {service.unit && (
                  <p className="text-xs text-gray-500">
                    Đơn vị: {service.unit}
                  </p>
                )}
              </div>
            </div>
            {service.durationMinutes && (
              <div className="flex items-center gap-3 text-gray-700 bg-purple-50 p-4 rounded-lg">
                <Clock size={24} className="text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Thời gian thực hiện</p>
                  <p className="text-xl font-bold text-purple-600">
                    {service.durationMinutes} phút
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Thông tin bảo hiểm */}
        {service.hasInsuranceSupport && service.percentApplyHealthInsurance && (
          <>
            <hr className="border-gray-200" />
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800">
                Hỗ trợ bảo hiểm y tế
              </h4>
              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-green-700">
                  <Shield size={20} className="text-green-600" />
                  <span className="font-semibold">
                    Được hỗ trợ bảo hiểm y tế{' '}
                    {service.percentApplyHealthInsurance}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-600">
                      Số tiền bảo hiểm chi trả
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {formatPrice(insuranceAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bạn cần thanh toán</p>
                    <p className="text-lg font-bold text-gray-700">
                      {formatPrice(service.price - insuranceAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Thông tin khoa */}
        {service.department && (
          <>
            <hr className="border-gray-200" />
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800">
                Thông tin khoa phòng
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {service.department.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Mã khoa: {service.department.code}
                    </p>
                    {service.department.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {service.department.description}
                      </p>
                    )}
                  </div>
                </div>
                {service.department.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Activity size={18} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Số điện thoại khoa
                      </p>
                      <p className="font-medium">{service.department.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Thông tin thống kê */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-800">
            Thông tin thêm
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {service._count && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Activity size={24} className="text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">
                  {service._count.serviceUsage}
                </p>
                <p className="text-sm text-gray-500">Lượt sử dụng</p>
              </div>
            )}
            {service.createdAt && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Calendar size={24} className="text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">
                  {formatDate(service.createdAt)}
                </p>
                <p className="text-sm text-gray-500">Ngày tạo</p>
              </div>
            )}
            {service.updatedAt && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Calendar size={24} className="text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">
                  {formatDate(service.updatedAt)}
                </p>
                <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
              </div>
            )}
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={() => {
              handleRegisterService();
            }}
          >
            Đăng ký dịch vụ
          </button>
        </div>
      </div>
    </CommonModal>
  );
}
