import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useImperativeHandle,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import '@styles/schedule.css';
import { getSchedules, deleteSchedule } from '@api/ApiSchedule';
import { ISchedule } from 'src/types';
import { toast } from 'react-toastify';
import {
  toDateKey,
  formatTimeFromIso,
  formatDateTimeFromIso,
} from 'src/utils/datetime';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type RequestPayload = { date: string; time: string; schedule?: ISchedule };
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

function buildShiftsFromApi(apiSchedules?: any[]) {
  if (!apiSchedules) return {};
  const out: Record<string, ISchedule[]> = {};
  for (const item of apiSchedules) {
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
      };

      out[dateKey] = out[dateKey] ?? [];
      out[dateKey].push(Schedule);
    } catch (err) {
      toast.error('Lỗi xử lý dữ liệu lịch từ máy chủ');
    }
  }
  return out;
}
function statusClassName(status?: string) {
  const s = (status ?? '').toLowerCase();
  switch (s) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
}
function statusDotClass(status?: string) {
  const s = (status ?? '').toLowerCase();
  switch (s) {
    case 'confirmed':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-400';
    case 'completed':
      return 'bg-gray-400';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
}

function statusBgContainer(status?: string) {
  const s = (status ?? '').toLowerCase();
  switch (s) {
    case 'confirmed':
      return 'bg-green-50';
    case 'pending':
      return 'bg-yellow-50';
    case 'completed':
      return 'bg-gray-50';
    case 'cancelled':
      return 'bg-red-50';
    default:
      return 'bg-white';
  }
}

export const ScheduleView = React.forwardRef(
  (
    {
      onRequestShift,
      schedules,
    }: {
      onRequestShift?: (p: RequestPayload) => void;
      schedules?: any[];
    },
    ref: React.Ref<any>
  ) => {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState<string>(toDateKey(today));
    const [displayYear, setDisplayYear] = useState<number>(today.getFullYear());
    const [displayMonth, setDisplayMonth] = useState<number>(today.getMonth());
    const [pendingDelete, setPendingDelete] = useState<ISchedule | null>(null);
    const secondDayOfDisplayMonth = useMemo(() => {
      return toDateKey(new Date(displayYear, displayMonth, 2));
    }, [displayYear, displayMonth]);

    const {
      data: schedulesData = [],
      isError,
      refetch,
    } = useQuery({
      queryKey: ['schedules', secondDayOfDisplayMonth, schedules],
      queryFn: () => getSchedules({ date: secondDayOfDisplayMonth }),
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    useEffect(() => {
      if (isError) {
        toast.error('Lỗi tải dữ liệu lịch từ máy chủ');
      }
    }, [isError]);

    useImperativeHandle(ref, () => ({
      refresh: () => {
        refetch();
      },
    }));

    async function deleteScheduleById(id: string | number) {
      deleteSchedule(id)
        .then(async () => {
          toast.success('Xóa lịch thành công');
          await refetch();
        })
        .catch((err) => {
          toast.error('Xóa lịch thất bại');
        });
    }

    const dataShifts: Record<string, ISchedule[]> = useMemo(() => {
      const source = schedulesData;
      return buildShiftsFromApi(source);
    }, [schedulesData]);

    function timeToMinutes(t: string) {
      const [hh, mm] = t.split(':').map(Number);
      return hh * 60 + mm;
    }

    function parseLocalToDate(date: string, time: string, dayOffset = 0) {
      const d = new Date(`${date}T${time}:00`);
      if (dayOffset) d.setDate(d.getDate() + dayOffset);
      return d;
    }

    function shiftMatchesDef(rec: ISchedule, def: (typeof SHIFT_DEFS)[number]) {
      if (!rec.startTime || !rec.endTime) return false;
      const recStart = formatTimeFromIso(rec.startTime);
      const recEnd = formatTimeFromIso(rec.endTime);
      const rStart = timeToMinutes(recStart);
      let rEnd = timeToMinutes(recEnd);
      if (rEnd <= rStart) rEnd += 24 * 60;

      const dStart = timeToMinutes(def.start);
      let dEnd = timeToMinutes(def.end);
      if (def.endNextDay || dEnd <= dStart) dEnd += 24 * 60;
      return rStart < dEnd && rEnd > dStart;
    }

    function goPrevMonth() {
      if (displayMonth === 0) {
        setDisplayMonth(11);
        setDisplayYear(displayYear - 1);
      } else {
        setDisplayMonth(displayMonth - 1);
      }
    }
    function goNextMonth() {
      if (displayMonth === 11) {
        setDisplayMonth(0);
        setDisplayYear(displayYear + 1);
      } else {
        setDisplayMonth(displayMonth + 1);
      }
    }
    function goToday() {
      setDisplayYear(today.getFullYear());
      setDisplayMonth(today.getMonth());
      setSelectedDate(toDateKey(today));
    }

    const firstOfMonth = new Date(displayYear, displayMonth, 1);
    const start = new Date(firstOfMonth);
    start.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

    const days = Array.from({ length: 42 }).map((_, i) => {
      const dt = new Date(start);
      dt.setDate(start.getDate() + i);
      const label = String(dt.getDate());
      const iso = toDateKey(dt);
      const inCurrentMonth =
        dt.getMonth() === displayMonth && dt.getFullYear() === displayYear;
      return { label, iso, inCurrentMonth };
    });

    const monthLabel = firstOfMonth.toLocaleString('vi-VN', {
      month: 'long',
      year: 'numeric',
    });

    return (
      <>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={goPrevMonth}
              className="px-2 py-1 rounded hover:bg-gray-100"
            >
              <ChevronLeft />
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
              <ChevronRight />
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
            const shifts = dataShifts[d.iso] ?? [];

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
                          className={`inline-block w-2 h-2 rounded-full ${statusDotClass(s.status)}`}
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

        <div className="mt-6 bg-gray-50 p-4 rounded">
          <h3 className="text-sm font-medium text-gray-800">Chi tiết ca</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Ngày: <span className="font-medium">{selectedDate}</span>
            </p>
            <ul className="mt-2 space-y-3">
              {SHIFT_DEFS.map((def) => {
                const shiftsForDay = dataShifts[selectedDate!] ?? [];
                const existing = shiftsForDay.find((s) =>
                  shiftMatchesDef(s, def)
                );
                const now = new Date();
                const shiftStart = parseLocalToDate(
                  selectedDate!,
                  def.start,
                  0
                );
                const allowRequest = now.getTime() < shiftStart.getTime();
                const displayTime = existing
                  ? `${formatTimeFromIso(existing.startTime)} - ${formatTimeFromIso(existing.endTime)}`
                  : `${def.start} - ${def.end}`;
                const payloadTime = existing
                  ? `${formatTimeFromIso(existing.startTime)}-${formatTimeFromIso(existing.endTime)}`
                  : `${def.start}-${def.end}`;

                return (
                  <li
                    key={def.key}
                    className="p-2 rounded border flex items-start justify-between bg-white"
                  >
                    <div className="flex-1 pr-4">
                      <div className="text-sm font-semibold">
                        {def.label} — {displayTime}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        <span className="mr-3">
                          Khoa:{' '}
                          <span className="font-medium">
                            {existing?.department?.name ?? '-'}
                          </span>
                        </span>
                        <span className="mr-3">
                          Loại:{' '}
                          <span className="font-medium">
                            {existing?.type ?? '-'}
                          </span>
                        </span>
                        <span className="mr-3">
                          Phòng:{' '}
                          <span className="font-medium">
                            {existing?.room?.name ?? '-'}
                          </span>
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        <span className="mr-3">
                          Trạng thái:{' '}
                          <span className="font-medium">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${statusClassName(existing?.status)}`}
                            >
                              {existing?.status ?? '-'}
                            </span>
                          </span>
                        </span>
                        <span className="mr-3">
                          Số slot:{' '}
                          <span className="font-medium">
                            {existing?.maxSlot ?? '-'}
                          </span>
                        </span>
                      </div>
                      {existing && (
                        <div className="text-xs text-gray-500 mt-2">
                          Bắt đầu: {formatDateTimeFromIso(existing.startTime)} ·
                          Kết thúc: {formatDateTimeFromIso(existing.endTime)}
                        </div>
                      )}
                    </div>
                    {existing ? (
                      allowRequest ? (
                        <div className="ml-4 flex flex-col items-end space-y-2">
                          <button
                            onClick={() => {
                              onRequestShift?.({
                                date: selectedDate!,
                                time: payloadTime,
                                schedule: existing,
                              });
                            }}
                            className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => setPendingDelete(existing)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Xóa lịch
                          </button>
                        </div>
                      ) : (
                        <div className="ml-4 text-xs text-gray-500">
                          Không thể chỉnh — ca đã bắt đầu/đã qua
                        </div>
                      )
                    ) : allowRequest ? (
                      <div className="ml-4">
                        <button
                          onClick={() =>
                            onRequestShift?.({
                              date: selectedDate!,
                              time: payloadTime,
                            })
                          }
                          className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
                        >
                          Đăng ký lịch mới
                        </button>
                      </div>
                    ) : (
                      <div className="ml-4 text-xs text-gray-500">
                        Không thể đăng ký — ca đã bắt đầu/đã qua
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {pendingDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setPendingDelete(null)}
            />
            <div className="bg-white rounded-lg shadow-lg z-10 w-[min(520px,90%)] p-6">
              <h4 className="text-lg font-semibold mb-2">Xác nhận xóa</h4>
              <p className="text-sm text-gray-700 mb-4">
                Bạn có chắc muốn xóa lịch ca này?
              </p>
              <div className="text-sm text-gray-600 mb-4">
                <div>
                  Ngày:{' '}
                  <span className="font-medium">{pendingDelete.date}</span>
                </div>
                <div>
                  Thời gian:{' '}
                  <span className="font-medium">
                    {formatTimeFromIso(pendingDelete.startTime)} -{' '}
                    {formatTimeFromIso(pendingDelete.endTime)}
                  </span>
                </div>
                <div>
                  Khoa / Phòng:{' '}
                  <span className="font-medium">
                    {pendingDelete.department?.name ?? '-'} /{' '}
                    {pendingDelete.room?.name ?? pendingDelete.roomId ?? '-'}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPendingDelete(null)}
                  className="px-4 py-2 bg-gray-100 rounded text-sm"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteScheduleById(pendingDelete.id);
                    setPendingDelete(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded text-sm"
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);
