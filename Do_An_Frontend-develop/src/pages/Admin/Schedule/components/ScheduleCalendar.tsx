import { useEffect, useMemo, useState } from 'react';
import { ISchedule } from '@src/types';
import {
  toDateKey,
  formatTimeFromIso,
  formatDateTimeFromIso,
  hhmmToMinutes,
} from 'src/utils/datetime';
import { toast } from 'react-toastify';

const SHIFT_DEFS = [
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

function buildShiftsFromApi(Schedules?: ISchedule[]) {
  if (!Schedules) return {};
  const out: Record<string, ISchedule[]> = {};
  for (const item of Schedules) {
    try {
      const dateObj = item.date ? new Date(item.date) : null;
      if (!dateObj) continue;
      const dateKey = toDateKey(dateObj);

      const Schedule: ISchedule = {
        id: item.id,
        staffId: item.staffId,
        staff: item.staff,
        departmentId: item.departmentId,
        department: item.department,
        roomId: item.roomId,
        room: item.room,
        type: item.type,
        date: dateKey,
        status: item.status,
        maxSlot: item.maxSlot,
        startTime: item.startTime,
        endTime: item.endTime,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      } as any;

      out[dateKey] = out[dateKey] ?? [];
      out[dateKey].push(Schedule);
    } catch (err) {
      toast.error('Lỗi xử lý dữ liệu lịch từ máy chủ', err as any);
    }
  }
  return out;
}

function shiftMatchesDef(rec: ISchedule, def: (typeof SHIFT_DEFS)[number]) {
  if (!rec.startTime || !rec.endTime) return false;
  const recStart = formatTimeFromIso(rec.startTime);
  const recEnd = formatTimeFromIso(rec.endTime);
  const rStart = hhmmToMinutes(recStart);
  let rEnd = hhmmToMinutes(recEnd);
  if (rEnd <= rStart) rEnd += 24 * 60;
  const dStart = hhmmToMinutes(def.start);
  let dEnd = hhmmToMinutes(def.end);
  if (def.endNextDay || dEnd <= dStart) dEnd += 24 * 60;
  return rStart < dEnd && rEnd > dStart;
}

type ScheduleCalendarProps = {
  schedules?: ISchedule[];
  loading?: boolean;
  onApproveClick?: (item: ISchedule, action: 'approve' | 'reject') => void;
  month?: number;
  year?: number;
  doctorId?: string | null;
  onDisplayMonthChange?: (year: number, month: number) => void;
};

export default function ScheduleCalendar({
  schedules,
  onApproveClick,
  month,
  year,
  doctorId,
  onDisplayMonthChange,
}: ScheduleCalendarProps) {
  const today = new Date();
  const initial =
    typeof month === 'number' && typeof year === 'number'
      ? new Date(year, month, 1)
      : new Date(today.getFullYear(), today.getMonth(), 1);
  const [display, setDisplay] = useState<Date>(initial);
  const [selectedDate, setSelectedDate] = useState<string>(toDateKey(today));

  useEffect(() => {
    if (typeof month === 'number' && typeof year === 'number')
      setDisplay(new Date(year, month, 1));
  }, [month, year]);

  useEffect(() => {
    onDisplayMonthChange?.(display.getFullYear(), display.getMonth());
  }, [display, onDisplayMonthChange]);

  useEffect(() => {
    const first = new Date(display.getFullYear(), display.getMonth(), 1);
    setSelectedDate(toDateKey(first));
  }, [display]);

  function goPrevMonth() {
    setDisplay((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function goNextMonth() {
    setDisplay((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
  function goToday() {
    setSelectedDate(toDateKey(today));
  }

  const firstOfMonth = new Date(display.getFullYear(), display.getMonth(), 1);
  const start = new Date(firstOfMonth);
  start.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());
  const days = Array.from({ length: 42 }).map((_, i) => {
    const dt = new Date(start);
    dt.setDate(start.getDate() + i);
    const label = String(dt.getDate());
    const iso = toDateKey(dt);
    const inCurrentMonth =
      dt.getMonth() === display.getMonth() &&
      dt.getFullYear() === display.getFullYear();
    return { label, iso, inCurrentMonth, date: dt };
  });

  const dataShifts = useMemo(() => {
    const map = buildShiftsFromApi(schedules as any[]);
    // if doctorId filter required, filter map entries
    if (!doctorId) return map;
    const out: Record<string, ISchedule[]> = {};
    for (const k of Object.keys(map)) {
      const arr = map[k].filter((item) => {
        const matchesDoctor =
          item.staffId === doctorId ||
          (item as any).doctorId === doctorId ||
          item.staff?.userId === doctorId ||
          item.staff?.staffId === doctorId;
        return matchesDoctor;
      });
      if (arr.length) out[k] = arr;
    }
    return out;
  }, [schedules, doctorId]);

  const shiftsByDay = useMemo(() => {
    const out: Record<string, ISchedule[]> = {};
    for (const d of days) {
      const list = dataShifts[d.iso] ?? [];
      const arr: ISchedule[] = [];
      const seen = new Set<string>();
      for (const def of SHIFT_DEFS) {
        const matched = list.filter((rec) => shiftMatchesDef(rec, def));
        for (const rec of matched) {
          const id = String(rec.id ?? `${rec.startTime}-${rec.endTime}`);
          if (!seen.has(id)) {
            seen.add(id);
            arr.push(rec);
          }
        }
      }
      // sort by start time for stable order
      arr.sort((a, b) => {
        const aStart = a.startTime ? new Date(a.startTime).getTime() : 0;
        const bStart = b.startTime ? new Date(b.startTime).getTime() : 0;
        return aStart - bStart;
      });
      out[d.iso] = arr;
    }
    return out;
  }, [days, dataShifts]);

  const monthLabel = firstOfMonth.toLocaleString('vi-VN', {
    month: 'long',
    year: 'numeric',
  });

  function getStartEnd(s: ISchedule) {
    try {
      if (!s.startTime || !s.endTime) return null;
      const start = new Date(s.startTime);
      let end = new Date(s.endTime);
      if (end.getTime() <= start.getTime())
        end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
      return { start, end };
    } catch {
      return null;
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={goPrevMonth}
            className="px-2 py-1 rounded hover:bg-gray-100"
          >
            ‹
          </button>
          <button
            onClick={goToday}
            className="px-3 py-1 rounded bg-gray-100 text-sm"
          >
            Hôm nay
          </button>
          <button
            onClick={goNextMonth}
            className="px-2 py-1 rounded hover:bg-gray-100"
          >
            ›
          </button>
        </div>
        <div className="text-base font-semibold">{monthLabel}</div>
        <div />
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-2">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((w, i) => (
          <div
            key={i}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5" id="scheduleGrid">
        {days.map((d, i) => {
          const shifts = shiftsByDay[d.iso] ?? [];
          const isSelected = selectedDate === d.iso;
          return (
            <div
              key={i}
              className={`text-center py-1 text-xs cursor-pointer rounded-lg border ${isSelected ? 'bg-primary/10 border-primary' : 'bg-white'} flex flex-col items-center justify-start min-h-[88px] overflow-hidden ${d.inCurrentMonth ? '' : 'opacity-50'}`}
              onClick={() => setSelectedDate(d.iso)}
            >
              <div
                className={`${shifts.length ? 'font-medium text-gray-900 text-sm' : 'text-gray-400 text-xs'} text-left px-2`}
              >
                <span className="inline-block truncate">{d.label}</span>
              </div>

              <div className="mt-1 space-y-0.5 px-2">
                {shifts.slice(0, 2).map((s, idx) => (
                  <div
                    key={idx}
                    className="text-[11px] bg-gray-100 px-1 py-0.5 rounded-md flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${s.status === 'pending' ? 'bg-yellow-400' : s.status === 'confirmed' ? 'bg-green-500' : 'bg-gray-400'}`}
                      />
                      <div className="truncate">
                        <div className="truncate text-[11px] font-medium">{`${formatTimeFromIso(s.startTime)} - ${formatTimeFromIso(s.endTime)}`}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {shifts.length > 2 && (
                  <div className="text-[11px] text-gray-500 truncate">
                    +{shifts.length - 2} ca
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 bg-gray-50 p-3 rounded text-sm">
        <h3 className="text-sm font-medium text-gray-800">Chi tiết ca</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            Ngày: <span className="font-medium">{selectedDate}</span>
          </p>
          <ul className="mt-2 space-y-2">
            {SHIFT_DEFS.map((def) => {
              const shiftsForDay = dataShifts[selectedDate] ?? [];
              const existing = shiftsForDay.find((s) =>
                shiftMatchesDef(s, def)
              );
              const now = new Date();
              const shiftStart = new Date(`${selectedDate}T${def.start}:00`);
              const allowRequest = now.getTime() < shiftStart.getTime();
              const displayTime = existing
                ? `${formatTimeFromIso(existing.startTime)} - ${formatTimeFromIso(existing.endTime)}`
                : `${def.start} - ${def.end}`;
              const se = existing ? getStartEnd(existing) : null;
              const canModify = se ? se.start.getTime() > now.getTime() : false;

              return (
                <li
                  key={def.key}
                  className="p-2 rounded border flex items-start justify-between bg-white"
                >
                  <div className="flex-1 pr-2">
                    <div className="text-sm font-semibold">
                      {def.label} — {displayTime}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      <span className="mr-2">
                        Khoa:{' '}
                        <span className="font-medium">
                          {existing?.department?.name ?? '-'}
                        </span>
                      </span>
                      <span className="mr-2">
                        Phòng:{' '}
                        <span className="font-medium">
                          {existing?.room?.name ?? '-'}
                        </span>
                      </span>
                      <span className="mr-2">
                        Trạng thái:{' '}
                        <span className="font-medium">
                          {existing?.status ?? '-'}
                        </span>
                      </span>
                    </div>
                    {existing && (
                      <div className="text-xs text-gray-500 mt-1">
                        Bắt đầu: {formatDateTimeFromIso(existing.startTime)} ·
                        Kết thúc: {formatDateTimeFromIso(existing.endTime)}
                      </div>
                    )}
                  </div>

                  {existing ? (
                    canModify ? (
                      <div className="ml-2 flex flex-col items-end space-y-2">
                        {existing.status !== 'confirmed' && onApproveClick && (
                          <button
                            onClick={() => onApproveClick(existing, 'approve')}
                            className="px-3 py-1 text-sm bg-primary text-white rounded"
                          >
                            Duyệt
                          </button>
                        )}
                        {existing.status !== 'cancelled' && onApproveClick && (
                          <button
                            onClick={() => onApproveClick(existing, 'reject')}
                            className="px-3 py-1 text-sm border rounded"
                          >
                            Không duyệt
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="ml-2 text-xs text-gray-400">
                        Không thể thao tác (đang/đã diễn ra)
                      </div>
                    )
                  ) : (
                    <div className="ml-2 text-xs text-gray-500">
                      {allowRequest
                        ? 'Trống — có thể đăng ký'
                        : 'Không thể đăng ký'}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
