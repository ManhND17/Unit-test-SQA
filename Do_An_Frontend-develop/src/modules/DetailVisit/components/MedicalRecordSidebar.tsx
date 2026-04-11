import { Clock } from 'lucide-react';
interface MedicalRecord {
  id: string;
  title: string;
  isParent: boolean;
  doctorName: string;
  time: string;
  isActive: boolean;
}
interface MedicalRecordSidebarProps {
  records: MedicalRecord[];
  onSelectRecord?: (id: string) => void;
}
export function MedicalRecordSidebar({
  records,
  onSelectRecord,
}: MedicalRecordSidebarProps) {
  return (
    <div className="bg-white">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Hồ sơ khám</h2>
      </div>

      <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        {records.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Không có hồ sơ khám nào.
          </div>
        ) : (
          records.map((record) => (
            <button
              key={record.id}
              onClick={() => onSelectRecord?.(record.id)}
              className={`w-full text-left p-4 rounded-lg transition-colors ${record.isActive ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-300 hover:bg-gray-100 border-2 border-transparent'}`}
            >
              <div className="font-medium text-gray-900 mb-1">
                {record.title}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Bác sĩ: {record.doctorName}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {record.time}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
