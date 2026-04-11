import Badge from '@src/components/CommonBadge';
import { mapVisitStatus } from '@src/utils/mapStatus';

interface PatientHeaderProps {
  patientName: string;
  gender: string;
  age: string;
  status: string;
  startTime: string;
  endTime: string;
}
export function PatientHeader({
  patientName,
  gender,
  age,
  status,
  startTime,
  endTime,
}: PatientHeaderProps) {
  const formatStatus = mapVisitStatus(status as any);
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-lg">
            <span className="font-semibold text-gray-900">Bệnh nhân:</span>
            <span className="text-gray-900">{patientName}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Giới tính: {gender}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{age}</span>
            <span className="text-gray-400">|</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant={formatStatus.variant}>{formatStatus.label}</Badge>
          <span className="text-sm text-gray-600">
            Thời gian: {startTime} - {endTime}
          </span>
        </div>
      </div>
    </div>
  );
}
