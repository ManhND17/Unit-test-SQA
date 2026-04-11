import {
  Pill,
  Building2,
  AlertCircle,
  ShieldAlert,
  Thermometer,
  Package,
  Info,
} from 'lucide-react';
import { IMedicine } from '@src/types';
import CommonModal from '@src/components/Modal';

interface ModalMedicineProps {
  open: boolean;
  onClose: () => void;
  medicine: IMedicine | null;
}

export default function ModalMedicine({
  open,
  onClose,
  medicine,
}: ModalMedicineProps) {
  if (!medicine) return null;

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | undefined | null;
  }) => (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className="text-sm text-gray-900 font-semibold">
        {value || '-'}
      </span>
    </div>
  );

  const ListSection = ({
    title,
    items,
    icon,
    color,
  }: {
    title: string;
    items: string[] | undefined;
    icon: React.ReactNode;
    color: string;
  }) => {
    if (!items || items.length === 0) return null;

    return (
      <div className={`p-4 rounded-lg border-l-4 ${color}`}>
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h4 className="font-semibold text-gray-900">{title}</h4>
        </div>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <span className="text-gray-400 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <CommonModal open={open} onClose={onClose} title="Chi tiết thuốc">
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 mb-6 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Pill className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{medicine.name}</h3>
                {medicine.genericName && (
                  <p className="text-purple-100 text-sm mb-1">
                    Hoạt chất: {medicine.genericName}
                  </p>
                )}
                {medicine.brandName && (
                  <p className="text-purple-100 text-sm">
                    Thương hiệu: {medicine.brandName}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Thông tin chung */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Thông tin chung
            </h4>
            <div className="space-y-1">
              <InfoRow label="Danh mục" value={medicine.category} />
              <InfoRow label="Dạng thuốc" value={medicine.form} />
              <InfoRow label="Liều lượng" value={medicine.dosage} />
              <InfoRow label="Đơn vị" value={medicine.unit} />
              <InfoRow
                label="Giá"
                value={`${medicine.price.toLocaleString('vi-VN')} đ`}
              />
            </div>
          </div>

          {/* Mô tả */}
          {medicine.description && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Mô tả
              </h4>
              <p className="text-sm text-gray-700">{medicine.description}</p>
            </div>
          )}

          {/* Nhà sản xuất */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-600" />
              Nhà sản xuất
            </h4>
            <div className="space-y-1">
              <InfoRow label="Hãng" value={medicine.manufacturer} />
              <InfoRow label="Quốc gia" value={medicine.country} />
            </div>
          </div>

          {/* Chỉ định */}
          <ListSection
            title="Chỉ định"
            items={medicine.indications}
            icon={<Pill className="w-5 h-5 text-green-600" />}
            color="border-green-500 bg-green-50"
          />

          {/* Chống chỉ định */}
          <ListSection
            title="Chống chỉ định"
            items={medicine.contraindications}
            icon={<ShieldAlert className="w-5 h-5 text-red-600" />}
            color="border-red-500 bg-red-50"
          />

          {/* Tác dụng phụ */}
          <ListSection
            title="Tác dụng phụ"
            items={medicine.sideEffects}
            icon={<AlertCircle className="w-5 h-5 text-orange-600" />}
            color="border-orange-500 bg-orange-50"
          />

          {/* Tương tác thuốc */}
          <ListSection
            title="Tương tác thuốc"
            items={medicine.interactions}
            icon={<AlertCircle className="w-5 h-5 text-yellow-600" />}
            color="border-yellow-500 bg-yellow-50"
          />

          {/* Điều kiện bảo quản */}
          {medicine.storageConditions && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-gray-600" />
                Hướng dẫn bảo quản
              </h4>
              <p className="text-sm text-gray-700">
                {medicine.storageConditions}
              </p>
            </div>
          )}
          {/* Status badge */}
          <div className="flex justify-center pt-4">
            <div
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold ${
                medicine.status === 'available'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <Package className="w-5 h-5" />
              {medicine.status === 'available'
                ? 'Thuốc đang có sẵn'
                : 'Thuốc tạm hết hàng'}
            </div>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}
