import React from 'react';
import Modal from '@src/components/Modal';
import { MapPin, Hash, Building2 } from 'lucide-react';
import Badge from '@components/CommonBadge';
import {
  IRoom,
  ERoomType,
  ERoomStatus,
  RoomTypeLabels,
  RoomStatusLabels,
} from '@src/types';

interface DetailRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: IRoom | null;
}

export function DetailRoomModal({
  isOpen,
  onClose,
  room,
}: DetailRoomModalProps) {
  if (!room) return null;

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

  const statusVariantMap: Record<
    ERoomStatus,
    'success' | 'warning' | 'error' | undefined
  > = {
    [ERoomStatus.NOT_USED]: 'error',
    [ERoomStatus.USED]: 'success',
    [ERoomStatus.MAINTENANCE]: 'warning',
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Chi tiết phòng">
      <div className="space-y-6">
        <div className="space-y-1">
          <InfoRow
            icon={Hash}
            label="Số phòng"
            value={room.number_room ?? '-'}
          />
          <InfoRow
            icon={Building2}
            label="Tên phòng"
            value={room.name ?? '-'}
          />
          <InfoRow icon={MapPin} label="Tầng" value={room.floor ?? '-'} />
          <InfoRow
            icon={Building2}
            label="Loại phòng"
            value={RoomTypeLabels[room.type as ERoomType] ?? String(room.type)}
          />
          <InfoRow
            icon={MapPin}
            label="Trạng thái"
            value={
              <Badge variant={statusVariantMap[room.status as ERoomStatus]}>
                {RoomStatusLabels[room.status as ERoomStatus] ??
                  String(room.status)}
              </Badge>
            }
          />
        </div>

        {/* Optional quick stats — adjust/remove as needed */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-semibold text-purple-600">
              {room.floor ?? '-'}
            </div>
            <div className="text-sm text-purple-700 mt-1">Tầng</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-semibold text-blue-600">
              {room.number_room ?? '-'}
            </div>
            <div className="text-sm text-blue-700 mt-1">Số phòng</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-semibold text-gray-800">
              {room.building?.name ?? '-'}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
