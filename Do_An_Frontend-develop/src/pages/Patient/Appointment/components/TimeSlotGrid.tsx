import { formatTimeFromIso } from '@src/utils/datetime';
import { ClockIcon } from 'lucide-react';

type TimeSlot = {
  start: string;
  end: string;
  available: boolean;
  scheduleId?: string;
};

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onChange: (timeSlot: TimeSlot) => void;
  error?: string;
  disabled?: boolean;
}

export default function TimeSlotGrid({
  slots,
  selectedTime,
  onChange,
  error,
  disabled,
}: TimeSlotGridProps) {
  if (disabled) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Giờ khám <span className="text-red-500">*</span>
        </label>
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm text-center">
          <ClockIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          Vui lòng chọn ngày khám trước
        </div>
      </div>
    );
  }
  // Split into morning and afternoon
  const morningSlots = slots.filter((s) => {
    const hour = parseInt(formatTimeFromIso(s.start).split(':')[0]);
    return hour < 12;
  });

  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(formatTimeFromIso(s.start).split(':')[0]);
    return hour >= 12;
  });

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800">
        Giờ khám <span className="text-red-500">*</span>
      </label>

      <div
        className={`
          bg-white border rounded-xl p-4 space-y-4
          ${error ? 'border-red-300' : 'border-gray-200'}
        `}
      >
        {/* Morning slots */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
            Buổi sáng
          </p>
          <div className="flex gap-2 flex-wrap">
            {morningSlots.map((slot) => (
              <TimeSlotButton
                key={slot.start}
                slot={slot}
                isSelected={selectedTime === slot.start}
                onClick={() => slot.available && onChange(slot)}
              />
            ))}
          </div>
        </div>

        {/* Afternoon slots */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
            Buổi chiều
          </p>
          <div className="flex gap-2 flex-wrap">
            {afternoonSlots.map((slot) => (
              <TimeSlotButton
                key={slot.start}
                slot={slot}
                isSelected={selectedTime === slot.start}
                onClick={() => slot.available && onChange(slot)}
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500">* Danh sách khung giờ trống</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}

interface TimeSlotButtonProps {
  slot: TimeSlot;
  isSelected: boolean;
  onClick: () => void;
}

function TimeSlotButton({ slot, isSelected, onClick }: TimeSlotButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!slot.available}
      className={`
        px-2 py-2 text-sm font-medium rounded-lg
        ${!slot.available ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through' : isSelected ? 'bg-teal-600 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-700 hover:border-teal-400 hover:bg-teal-50'}
      `}
      aria-label={`${slot.start} ${slot.available ? 'còn trống' : 'đã kín'}`}
      aria-pressed={isSelected}
    >
      {formatTimeFromIso(slot.start)}
    </button>
  );
}
