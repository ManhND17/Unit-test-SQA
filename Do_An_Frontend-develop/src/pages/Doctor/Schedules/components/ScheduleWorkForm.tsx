import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ISchedule,
  EScheduleType,
  EScheduleStatus,
  IDepartment,
} from 'src/types';
import ApiDepartment from '@api/ApiDepartment';
import { updateSchedule, createSchedule } from '@api/ApiSchedule';
import { toast } from 'react-toastify';
import { convertlocalToISO } from '@src/utils/datetime';

type IScheduleWorkFormProps = {
  initial?: Partial<ISchedule>;
  currentStaffId?: string;
  onSubmit: (payload: Partial<ISchedule>) => void;
  onCancel?: () => void;
  refetch?: () => void;
};

const SHIFT_DEFS = {
  ca1: { label: 'Ca 1', start: '07:00', end: '13:00', endNextDay: false },
  ca2: { label: 'Ca 2', start: '13:00', end: '19:00', endNextDay: false },
  ca3: { label: 'Ca 3 (Đêm)', start: '19:00', end: '07:00', endNextDay: true },
} as const;

type ShiftKey = keyof typeof SHIFT_DEFS;

function toLocalDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-CA');
}

export default function ScheduleWorkForm({
  initial = {},
  currentStaffId,
  onSubmit,
  onCancel,
  refetch,
}: IScheduleWorkFormProps) {
  const departmentsRef = useRef<IDepartment[]>([]);
  const [shift, setShift] = useState<ShiftKey>(() => {
    if (!initial.startTime) return 'ca1';
    const hour = new Date(initial.startTime).getHours();
    if (hour >= 7 && hour < 13) return 'ca1';
    if (hour >= 13 && hour < 19) return 'ca2';
    return 'ca3';
  });

  const [departmentId, setDepartmentId] = useState<number>(
    initial.departmentId ?? 1
  );
  const [type, setType] = useState<EScheduleType>(
    initial.type ?? EScheduleType.APPOINTMENT
  );
  const [roomId, setRoomId] = useState<string>(initial.roomId ?? '');
  const [date, setDate] = useState<string>(
    toLocalDate(initial.startTime) || ''
  );
  const [maxSlot, setMaxSlot] = useState<number>(initial.maxSlot ?? 10);
  const [startTime, setStartTime] = useState<string>(SHIFT_DEFS[shift].start);
  const [endTime, setEndTime] = useState<string>(SHIFT_DEFS[shift].end);
  const [endDayOffset, setEndDayOffset] = useState<number>(
    SHIFT_DEFS[shift].endNextDay ? 1 : 0
  );
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<IDepartment[]>([]);

  const currentDeptRooms = useMemo(() => {
    const list = departments.length ? departments : departmentsRef.current;
    const dep = list.find((d) => d.id === departmentId);
    if (!dep) return [];
    const r = (dep as any).rooms ?? (dep as any).room;
    if (!r) return [];
    return Array.isArray(r) ? r : [r];
  }, [departments, departmentId]);

  useEffect(() => {
    if (!currentDeptRooms || currentDeptRooms.length === 0) return;
    const first = currentDeptRooms[0] as any;
    const id = first?.id ?? first?.roomId ?? first?.uuid;
    if (id && id !== roomId) setRoomId(String(id));
  }, [currentDeptRooms, roomId]);

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  useEffect(() => {
    const def = SHIFT_DEFS[shift];
    setStartTime(def.start);
    setEndTime(def.end);
    setEndDayOffset(def.endNextDay ? 1 : 0);
    if (!date) {
      const today = new Date();
      setDate(today.toLocaleDateString('en-CA'));
    }
  }, [shift, date]);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const dept = await ApiDepartment.getDepartments({ limit: 100 });
        setDepartments(dept.departments);
        departmentsRef.current = dept.departments;
      } catch {
        toast.error('Lỗi tải danh sách khoa từ máy chủ');
      }
    };

    fetchDepartment();
  }, []);

  const validate = (staffId: string): boolean => {
    setError(null);
    if (!staffId) return (setError('Chưa xác định bác sĩ'), false);
    if (!roomId) return (setError('Chưa chọn phòng'), false);
    if (!date) return (setError('Chưa chọn ngày'), false);
    const [yy, mm, dd] = date.split('-').map(Number);
    const selectedDateMidnight = new Date(yy, mm - 1, dd).getTime();
    if (selectedDateMidnight < todayStart)
      return (setError('Không thể đặt lịch ngày đã qua'), false);

    if (!startTime || !endTime) return (setError('Chưa chọn giờ'), false);

    const startIso = convertlocalToISO(`${date}T${startTime}:00`);
    const endIso = convertlocalToISO(
      `${date}T${endTime}:00${endDayOffset === 1 ? '+1 day' : ''}`.trim()
    );
    if (!startIso || !endIso) return (setError('Giờ không hợp lệ'), false);

    const startTs = new Date(startIso.replace('+07:00', 'Z')).getTime();
    const endTs = new Date(endIso.replace('+07:00', 'Z')).getTime();
    if (startTs >= endTs)
      return (setError('Giờ kết thúc phải sau giờ bắt đầu'), false);

    const minDuration = shift === 'ca3' ? 10 : 5;
    if ((endTs - startTs) / 3600000 < minDuration) {
      return (
        setError(
          shift === 'ca3' ? 'Ca đêm ít nhất 10 giờ' : 'Ca ít nhất 5 giờ'
        ),
        false
      );
    }

    if (maxSlot == null || maxSlot < 0)
      return (setError('Số slot không hợp lệ'), false);

    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const staffId = currentStaffId ?? '';
    if (!validate(staffId)) return;

    const payload: Partial<ISchedule> = {
      departmentId,
      type,
      roomId,
      date,
      status: EScheduleStatus.PENDING,
      maxSlot: Number(maxSlot),
      startTime: convertlocalToISO(`${date}T${startTime}:00`)!,
      endTime: convertlocalToISO(
        `${date}T${endTime}:00${endDayOffset === 1 ? '+1 day' : ''}`.trim()
      )!,
    };

    try {
      let resp: any = null;
      if (initial.id) {
        payload.id = initial.id;
        resp = await updateSchedule(payload);
        toast.success('Cập nhật lịch thành công!');
      } else {
        payload.staffId = staffId;
        resp = await createSchedule(payload);
        toast.success('Tạo lịch thành công!');
      }

      onSubmit(resp);
      if (refetch) {
        refetch();
      }
    } catch {
      setError('Lưu lịch thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600 font-medium">{error}</div>}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Chọn ca</label>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(SHIFT_DEFS) as ShiftKey[]).map((k) => (
            <label
              key={k}
              className={`px-3 py-1.5 rounded border cursor-pointer text-sm font-medium transition ${
                shift === k
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="shift"
                value={k}
                checked={shift === k}
                onChange={() => setShift(k)}
                className="hidden"
              />
              {SHIFT_DEFS[k].label}
            </label>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Khoa</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            {(departments.length ? departments : departmentsRef.current).map(
              (d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              )
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Phòng</label>
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="">-- Chọn phòng --</option>
            {currentDeptRooms.map((r: any) => (
              <option
                key={r.id ?? r.roomId ?? r.uuid}
                value={r.id ?? r.roomId ?? r.uuid}
              >
                {r.name ?? r.number_room ?? r.id ?? r.roomId ?? r.uuid}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Ngày</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Bắt đầu</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Kết thúc</label>
          <div className="flex gap-1 items-center">
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            {endDayOffset === 1 && (
              <span className="text-xs text-gray-500 self-center">
                (+1 ngày)
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Loại lịch</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as EScheduleType)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            {Object.values(EScheduleType).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Số slot tối đa
          </label>
          <input
            type="number"
            min={0}
            value={maxSlot}
            onChange={(e) => setMaxSlot(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
        >
          Lưu lịch
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
