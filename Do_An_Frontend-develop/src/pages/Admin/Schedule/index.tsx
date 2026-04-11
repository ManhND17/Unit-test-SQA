import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DoctorSelect from './components/DoctorSelect';
import ScheduleCalendar from './components/ScheduleCalendar';
import ModalApprove from './components/ModalApprove';
import { ISchedule, EScheduleStatus } from '@src/types';
import { getSchedulesAdmin } from '@api/ApiSchedule';
import ApiDoctor from '@api/ApiDoctor';

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

function hhmmToMinutes(hhmm: string) {
  const [hh, mm] = hhmm.split(':').map((v) => parseInt(v, 10));
  return hh * 60 + mm;
}

function mapDefKeyToUiShift(defKey: string) {
  if (defKey === 'ca1') return 'morning';
  if (defKey === 'ca2') return 'afternoon';
  return 'night';
}

function getShiftFromStartTime(
  startIso?: string
): 'morning' | 'afternoon' | 'night' {
  if (!startIso) return 'morning';
  const d = new Date(startIso);
  const minutes = d.getUTCHours() * 60 + d.getUTCMinutes();

  for (const def of SHIFT_DEFS) {
    const startM = hhmmToMinutes(def.start);
    const endM = hhmmToMinutes(def.end);

    if (def.endNextDay) {
      if (minutes >= startM || minutes < endM)
        return mapDefKeyToUiShift(def.key);
    } else {
      if (minutes >= startM && minutes < endM)
        return mapDefKeyToUiShift(def.key);
    }
  }
  return 'morning';
}

export default function SchedulePage() {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<
    (ISchedule & { shift: 'morning' | 'afternoon' | 'night' })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [approveItem, setApproveItem] = useState<
    (ISchedule & { shift: 'morning' | 'afternoon' | 'night' }) | null
  >(null);
  const [approveAction, setApproveAction] = useState<
    'approve' | 'reject' | null
  >(null);

  const now = new Date();
  const [displayYear, setDisplayYear] = useState<number>(now.getFullYear());
  const [displayMonth, setDisplayMonth] = useState<number>(now.getMonth());

  const doctorData = useQuery({
    queryKey: ['admin-schedules', selectedDoctor, displayYear, displayMonth],
    queryFn: async () => ApiDoctor.getListDoctor({ limit: 100 }),
    staleTime: Infinity,
  });

  function pad(n: number) {
    return String(n).padStart(2, '0');
  }
  function secondDayOf(year: number, month0: number) {
    return `${year}-${pad(month0 + 1)}-02`;
  }

  async function loadFor(
    doctorId: string | null,
    year: number,
    month0: number
  ) {
    if (!doctorId) return;
    const date2 = secondDayOf(year, month0);
    const payload = { doctorId, date: date2 };

    setLoading(true);
    const res = await getSchedulesAdmin(payload);
    const mapped = res.map((s: any) => {
      const hasShift = s.shift;
      const computedShift = hasShift
        ? s.shift
        : getShiftFromStartTime(s.startTime);
      return { ...s, shift: computedShift } as ISchedule & {
        shift: 'morning' | 'afternoon' | 'night';
      };
    });
    setSchedules(mapped);
    setLoading(false);
  }

  useEffect(() => {
    if (!selectedDoctor) {
      setSchedules([]);
      return;
    }
    loadFor(selectedDoctor, displayYear, displayMonth);
  }, [selectedDoctor, displayYear, displayMonth]);

  const onApprove = (
    item: ISchedule & { shift?: 'morning' | 'afternoon' | 'night' },
    action: 'approve' | 'reject'
  ) => {
    setApproveItem(
      item as ISchedule & { shift: 'morning' | 'afternoon' | 'night' }
    );
    setApproveAction(action);
  };

  const confirmApprove = (id: string, action: 'approve' | 'reject') => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status:
                action === 'approve'
                  ? EScheduleStatus.CONFIRMED
                  : EScheduleStatus.CANCELLED,
            }
          : s
      )
    );
    setApproveItem(null);
    setApproveAction(null);
  };

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Quản lý lịch làm việc - Bác sĩ
        </h2>
        <DoctorSelect
          doctors={doctorData.data?.data || []}
          value={selectedDoctor}
          onChange={(id) => setSelectedDoctor(id)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        {!selectedDoctor ? (
          // waiting UI when no doctor selected
          <div className="py-20 text-center text-gray-500">
            <div className="text-lg font-medium mb-2">
              Vui lòng chọn bác sĩ để xem lịch
            </div>
            <div className="text-sm">
              Chọn bác sĩ từ dropdown ở trên — khi chọn, hệ thống sẽ gửi payload
              gồm id bác sĩ và ngày '02' của tháng đang hiển thị.
            </div>
          </div>
        ) : (
          <ScheduleCalendar
            schedules={schedules}
            loading={loading}
            onApproveClick={onApprove}
            doctorId={selectedDoctor}
            month={displayMonth}
            year={displayYear}
            onDisplayMonthChange={(y: number, m: number) => {
              setDisplayYear(y);
              setDisplayMonth(m);
            }}
          />
        )}
      </div>

      <ModalApprove
        item={approveItem}
        action={approveAction}
        onClose={() => {
          setApproveItem(null);
          setApproveAction(null);
        }}
        onConfirm={() =>
          confirmApprove(approveItem?.id ?? '', approveAction ?? 'approve')
        }
      />
    </main>
  );
}
