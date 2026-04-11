import React, { useRef } from 'react';
import { ScheduleView } from './components/ScheduleView';
import ScheduleWorkForm from './components/ScheduleWorkForm';
import Sidebar from '../components/Sidebar';
import { IRootState } from '@src/redux/store';
import { useSelector } from 'react-redux';
import { ISchedule } from '@src/types';
import { toast } from 'react-toastify';

export default function SchedulePage() {
  const [showWorkForm, setShowWorkForm] = React.useState(false);
  const [workInitial, setWorkInitial] = React.useState<any | null>(null);
  const user = useSelector((state: IRootState) => state.auth.user);
  const ref = useRef<{ refresh?: () => void } | null>(null);

  async function apiSaveSchedule(payload: any) {
    return { ...payload, id: payload.id ?? 'generated-id' };
  }

  const handleRefetchSchedules = () => {
    ref.current?.refresh?.();
  };

  function openWorkFormForShift(p?: {
    date?: string;
    time?: string;
    schedule?: ISchedule;
  }) {
    if (p) {
      const parts = (p.time || '').split('-');
      const startLocal = parts[0]
        ? `${p.date}T${parts[0]}:00`
        : `${p.date}T09:00:00`;
      const endLocal = parts[1]
        ? `${p.date}T${parts[1]}:00`
        : `${p.date}T12:00:00`;
      setWorkInitial({
        id: p.schedule?.id,
        staffId: p.schedule?.staffId ?? '',
        departmentId: p.schedule?.departmentId ?? 1,
        type: p.schedule?.type ?? 'appointment',
        roomId: p.schedule?.roomId ?? '',
        date: p.date,
        status: p.schedule?.status ?? 'confirmed',
        maxSlot: p.schedule?.maxSlot ?? 10,
        startTime: new Date(startLocal).toISOString() ?? p.schedule?.startTime,
        endTime: new Date(endLocal).toISOString() ?? p.schedule?.endTime,
      });
    } else {
      setWorkInitial(null); // tạo mới rỗng
    }
    setShowWorkForm(true);
  }

  async function handleWorkSubmit(payload: any) {
    try {
      const saved = await apiSaveSchedule(payload);
      // notify app / reload calendar data
      window.dispatchEvent(new CustomEvent('scheduleSaved', { detail: saved }));
      setShowWorkForm(false);
    } catch {
      toast.error('Lưu lịch thất bại');
    }
  }

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch làm việc</h1>
          <p className="text-gray-600 mt-1">Xem lịch ca, đăng ký thay đổi ca</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-auto">
            {/* pass callback to ScheduleView: mở modal tạo/sửa lịch (ScheduleWorkForm) */}
            <ScheduleView
              onRequestShift={(p) => {
                openWorkFormForShift(p);
              }}
              ref={ref}
            />
          </div>
        </div>

        <div className="space-y-6">
          <Sidebar />
        </div>
      </div>
      {showWorkForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowWorkForm(false)}
          />
          <div className="relative bg-white p-6 rounded shadow-lg w-full max-w-2xl z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Tạo / Sửa ca</h3>
              <button
                onClick={() => setShowWorkForm(false)}
                className="text-sm text-gray-600"
              >
                Đóng
              </button>
            </div>
            <ScheduleWorkForm
              initial={workInitial ?? undefined}
              currentStaffId={user?.id}
              onSubmit={handleWorkSubmit}
              onCancel={() => setShowWorkForm(false)}
              refetch={handleRefetchSchedules}
            />
          </div>
        </div>
      )}
    </main>
  );
}
