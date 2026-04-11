import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface ICalendarProps {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
  error?: string;
}

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTHS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Add empty slots for days before the first day of month
  const startPadding = firstDay.getDay();
  for (let i = 0; i < startPadding; i++) {
    const prevDate = new Date(year, month, -startPadding + i + 1);
    days.push(prevDate);
  }
  // Add all days in the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }
  // Add empty slots to complete the last week
  const endPadding = 6 - lastDay.getDay();
  for (let i = 1; i <= endPadding; i++) {
    days.push(new Date(year, month + 1, i));
  }
  return days;
}

export default function Calendar({
  selectedDate,
  onChange,
  error,
}: ICalendarProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const days = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const currentMonth = viewDate.getMonth();

  const goToPrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const canGoPrev =
    viewDate.getMonth() > today.getMonth() ||
    viewDate.getFullYear() > today.getFullYear();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800">
        Ngày khám <span className="text-red-500">*</span>
      </label>

      <div
        className={`
          bg-white border rounded-xl p-4 
          ${error ? 'border-red-300' : 'border-gray-200'}
        `}
        role="application"
        aria-label="Chọn ngày khám"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={goToPrevMonth}
            disabled={!canGoPrev}
            className={`
              p-2 rounded-lg transition-colors
              ${canGoPrev ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-300 cursor-not-allowed'}
            `}
            aria-label="Tháng trước"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          <h3 className="text-base font-semibold text-gray-900">
            {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
          </h3>

          <button
            type="button"
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
            aria-label="Tháng sau"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={`
                text-center text-xs font-medium py-2
                ${index === 0 ? 'text-red-500' : 'text-gray-500'}
              `}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1" role="grid">
          {days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = isSameDay(date, today);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isPast = isPastDate(date);
            const isSunday = date.getDay() === 0;
            const isDisabled = isPast || !isCurrentMonth;
            return (
              <button
                key={index}
                type="button"
                onClick={() => !isDisabled && onChange(date)}
                disabled={isDisabled}
                className={`
                  relative p-2 text-sm rounded-lg transition-all duration-200
                  ${isDisabled ? 'text-gray-300 cursor-not-allowed' : isSelected ? 'bg-teal-600 text-white font-semibold' : isToday ? 'bg-teal-100 text-teal-700 font-semibold hover:bg-teal-200' : isSunday ? 'text-red-500 hover:bg-gray-100' : 'text-gray-700 hover:bg-gray-100'}
                  ${!isCurrentMonth ? 'opacity-40' : ''}
                `}
                aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
                aria-selected={isSelected || undefined}
                aria-disabled={isDisabled}
              >
                {date.getDate()}
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
