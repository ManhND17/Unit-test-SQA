import { useEffect, useState } from 'react';
import { getSchedules } from '@api/ApiSchedule';
import { formatTimeFromIso, toDateKey } from '@src/utils/datetime';
import { ISchedule } from '@src/types';

interface ShiftDef {
  key: string;
  label: string;
  start: string;
  end: string;
  endNextDay: boolean;
}

const SHIFT_DEFS: ShiftDef[] = [
  {
    key: 'ca1',
    label: 'Ca 1',
    start: '07:00',
    end: '13:00',
    endNextDay: false,
  },
  {
    key: 'ca2',
    label: 'Ca 2',
    start: '13:00',
    end: '19:00',
    endNextDay: false,
  },
  {
    key: 'ca3',
    label: 'Ca 3 (Đêm)',
    start: '19:00',
    end: '07:00',
    endNextDay: true,
  },
];

function timeToMinutes(t: string): number {
  const [hh, mm] = t.split(':').map(Number);
  return hh * 60 + mm;
}

function getShiftStatus(
  shiftDef: ShiftDef
): 'current' | 'upcoming' | 'completed' {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const startMinutes = timeToMinutes(shiftDef.start);
  let endMinutes = timeToMinutes(shiftDef.end);
  if (shiftDef.endNextDay || endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }
  if (endMinutes > 24 * 60 && currentMinutes < startMinutes) {
    return 'completed';
  }

  if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
    return 'current';
  } else if (currentMinutes < startMinutes) {
    return 'upcoming';
  }
  return 'completed';
}

function Schedule() {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [todayDateKey, setTodayDateKey] = useState<string>('');
  const [, setTimeUpdate] = useState(0); // Để trigger re-render mỗi phút

  useEffect(() => {
    const today = new Date();
    const dateKey = toDateKey(today);
    setTodayDateKey(dateKey);
    setLoading(true);

    getSchedules({ date: dateKey })
      .then((data) => {
        setSchedules(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setSchedules([]);
      })
      .finally(() => {
        setLoading(false);
      });
    const handleScheduleSaved = () => {
      getSchedules({ date: dateKey })
        .then((data) => {
          setSchedules(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          setSchedules([]);
        });
    };

    window.addEventListener('scheduleSaved', handleScheduleSaved);
    return () =>
      window.removeEventListener('scheduleSaved', handleScheduleSaved);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate((prev) => prev + 1);
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Lịch làm việc hôm nay: {new Date().toLocaleDateString()}
        </h3>
        <p className="text-sm text-gray-500">Đang tải...</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Lịch làm việc hôm nay: {new Date().toLocaleDateString()}
      </h3>
      <div className="space-y-3">
        {SHIFT_DEFS.map((shiftDef) => {
          const today = toDateKey(new Date());

          const shiftSchedules = schedules.filter((s) => {
            if (!s.date) return false;
            const scheduleDate = toDateKey(new Date(s.date));
            if (scheduleDate !== today) return false;

            if (!s.startTime || !s.endTime) return false;
            const startStr = formatTimeFromIso(s.startTime);
            const endStr = formatTimeFromIso(s.endTime);
            const scheduleStart = timeToMinutes(startStr);
            let scheduleEnd = timeToMinutes(endStr);
            if (scheduleEnd <= scheduleStart) scheduleEnd += 24 * 60;

            const defStart = timeToMinutes(shiftDef.start);
            let defEnd = timeToMinutes(shiftDef.end);
            if (shiftDef.endNextDay || defEnd <= defStart) defEnd += 24 * 60;

            return scheduleStart < defEnd && scheduleEnd > defStart;
          });

          const hasSchedule = shiftSchedules.length > 0;

          let status: 'current' | 'upcoming' | 'completed' | 'no-schedule';
          if (!hasSchedule) {
            status = 'no-schedule';
          } else {
            status = getShiftStatus(shiftDef);
          }

          const bgColor = status === 'current' ? 'bg-blue-50' : 'bg-gray-50';
          const dotColor =
            status === 'current'
              ? 'bg-green-400'
              : status === 'upcoming'
                ? 'bg-blue-400'
                : 'bg-gray-300';
          const statusLabel =
            status === 'current'
              ? 'Đang diễn ra'
              : status === 'upcoming'
                ? 'Sắp tới'
                : status === 'completed'
                  ? 'Kết thúc'
                  : 'Không có lịch';
          const statusBgColor =
            status === 'current'
              ? 'bg-green-100 text-green-800'
              : status === 'upcoming'
                ? 'bg-blue-100 text-blue-800'
                : status === 'no-schedule'
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-gray-200 text-gray-700';

          return (
            <div
              key={shiftDef.key}
              className={`flex items-center justify-between p-3 rounded-lg ${bgColor}`}
            >
              <div className="flex items-center">
                <div className={`w-2 h-2 ${dotColor} rounded-full mr-3`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {shiftDef.label}
                  </p>
                  <p className="text-xs text-gray-600">
                    {shiftDef.start} - {shiftDef.end}
                  </p>
                  {hasSchedule && (
                    <p className="text-xs text-gray-500 mt-1">
                      {shiftSchedules[0].department?.name ||
                        shiftSchedules[0].room?.name ||
                        'Ca làm việc'}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${statusBgColor}`}
              >
                {statusLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <div className="space-y-6">
      <Schedule />
    </div>
  );
}
