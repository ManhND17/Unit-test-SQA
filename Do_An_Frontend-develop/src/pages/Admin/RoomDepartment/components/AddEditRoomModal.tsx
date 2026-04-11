import React, { useEffect, useState } from 'react';
import Modal from '@src/components/Modal';
import Input from '@src/components/CommonInput';
import { Hash, MapPin, Building2 } from 'lucide-react';
import {
  IRoom,
  ERoomType,
  ERoomStatus,
  RoomTypeLabels,
  RoomStatusLabels,
  IBuilding,
} from '@src/types';

interface AddEditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (room: Omit<IRoom, 'id' | 'createdAt' | 'updatedAt'>) => void;
  room?: IRoom | null;
  mode: 'create' | 'edit';
  availableBuildings?: IBuilding[]; // added
}

export function AddEditRoomModal({
  isOpen,
  onClose,
  onSubmit,
  room,
  mode,
  availableBuildings = [],
}: AddEditRoomModalProps) {
  type RoomFormData = Omit<IRoom, 'id' | 'createdAt' | 'updatedAt'>;

  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    number_room: 101,
    floor: 1,
    type: ERoomType.EXAMINATION,
    status: ERoomStatus.NOT_USED,
    buildingId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (room && mode === 'edit') {
      setFormData({
        name: room.name,
        number_room: room.number_room,
        floor: room.floor,
        type: room.type,
        status: room.status,
        buildingId: room.buildingId,
      });
    } else {
      setFormData({
        name: '',
        number_room: 101,
        floor: 1,
        type: ERoomType.EXAMINATION,
        status: ERoomStatus.NOT_USED,
        buildingId: availableBuildings?.[0]?.id ?? '',
      });
    }
    setErrors({});
  }, [room, mode, isOpen, availableBuildings]); // include availableBuildings

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Tên phòng không được để trống';
    if (formData.number_room < 1) newErrors.number_room = 'Số phòng phải >= 1';
    if (formData.floor < 1) newErrors.floor = 'Tầng phải >= 1';
    if (!formData.buildingId) newErrors.buildingId = 'Vui lòng chọn tòa nhà';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onSubmit(formData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Thêm phòng mới' : 'Chỉnh sửa thông tin phòng'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tòa nhà <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.buildingId}
            onChange={(e) =>
              setFormData({
                ...formData,
                buildingId: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] focus:border-transparent"
          >
            <option value="">Chọn tòa nhà</option>
            {availableBuildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.buildingId && (
            <p className="text-red-500 text-sm mt-1">{errors.buildingId}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số phòng <span className="text-red-500">*</span>
            </label>
            <Input
              icon={Hash}
              type="number"
              min="1"
              value={formData.number_room}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  number_room: parseInt(e.target.value as string, 10) || 1,
                })
              }
              className={errors.number_room ? 'border-red-500' : ''}
            />
            {errors.number_room && (
              <p className="text-red-500 text-sm mt-1">{errors.number_room}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tầng <span className="text-red-500">*</span>
            </label>
            <Input
              icon={MapPin}
              type="number"
              min="1"
              value={formData.floor}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  floor: parseInt(e.target.value as string, 10) || 1,
                })
              }
              className={errors.floor ? 'border-red-500' : ''}
            />
            {errors.floor && (
              <p className="text-red-500 text-sm mt-1">{errors.floor}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên phòng <span className="text-red-500">*</span>
          </label>
          <Input
            icon={Building2}
            placeholder="VD: Phòng khám tim mạch"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại phòng
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as ERoomType,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] focus:border-transparent"
            >
              {(Object.values(ERoomType) as ERoomType[]).map((type) => (
                <option key={type} value={type}>
                  {RoomTypeLabels[type]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ERoomStatus,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] focus:border-transparent"
            >
              {(Object.values(ERoomStatus) as ERoomStatus[]).map((status) => (
                <option key={status} value={status}>
                  {RoomStatusLabels[status]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 bg-[#5B5FEF] text-white hover:bg-[#4A4ED8] min-w-[120px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang lưu...
              </span>
            ) : mode === 'create' ? (
              'Thêm phòng'
            ) : (
              'Lưu thay đổi'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
