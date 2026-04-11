import { IDoctor } from '@src/types';
import { StarIcon, LoaderIcon } from 'lucide-react';

interface DoctorCardProps {
  doctors: IDoctor[];
  selectedId: string | null;
  onChange: (id: string | null) => void;
  isLoading?: boolean;
  disabled?: boolean;
}
export default function DoctorCard({
  doctors,
  selectedId,
  onChange,
  isLoading,
  disabled,
}: DoctorCardProps) {
  if (disabled) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          Chọn Bác sĩ{' '}
          <span className="text-gray-400 font-normal">(Tùy chọn)</span>
        </label>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm">
          Vui lòng chọn chuyên khoa trước
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          Chọn Bác sĩ{' '}
          <span className="text-gray-400 font-normal">(Tùy chọn)</span>
        </label>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center gap-2 text-gray-500">
          <LoaderIcon className="w-5 h-5 animate-spin" />
          <span>Đang tải danh sách bác sĩ...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800">
        Chọn Bác sĩ{' '}
        <span className="text-gray-400 font-normal">(Tùy chọn)</span>
      </label>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {/* Doctor list */}
        {doctors.map((doctor, idx) => {
          const id = doctor.userId ?? doctor.user?.id ?? null;
          const isSelected = selectedId === id;
          return (
            <button
              key={id ?? 'doctor-' + idx}
              type="button"
              onClick={() => onChange(id)}
              className={`${
                'w-full p-3 rounded-lg border-2 text-left transition-all duration-200 flex items-center gap-3 ' +
                (isSelected
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50')
              }`}
              aria-pressed={isSelected}
            >
              <img
                src={doctor.user?.avatar || ''}
                alt=""
                className="w-10 h-10 rounded-full bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {doctor.level ? `${doctor.level}. ` : ''}
                  {(doctor.user?.name?.firstName || '') +
                    ' ' +
                    (doctor.user?.name?.lastName || '')}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {doctor.specialization}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm text-amber-600">
                <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{doctor.experienceYears} năm</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
