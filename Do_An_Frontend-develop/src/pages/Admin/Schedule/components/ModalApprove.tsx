import { useState } from 'react';
import { approveScheduleAdmin, rejectScheduleAdmin } from '@api/ApiSchedule';
import { formatTimeFromIso, formatDateTimeFromIso } from 'src/utils/datetime';
import { toast } from 'react-toastify';

type ModalApproveProps = {
  item: any | null;
  action?: 'approve' | 'reject' | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ModalApprove({
  item,
  action,
  onClose,
  onConfirm,
}: ModalApproveProps) {
  const [loading, setLoading] = useState(false);
  if (!item || !action) return null;
  function getStartEnd(s: any) {
    try {
      const date = s.date ? new Date(s.date) : new Date();
      const st = s.startTime ? new Date(s.startTime) : null;
      const en = s.endTime ? new Date(s.endTime) : null;
      if (!st || !en) return null;
      const start = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        st.getHours(),
        st.getMinutes(),
        st.getSeconds()
      );
      let end = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        en.getHours(),
        en.getMinutes(),
        en.getSeconds()
      );
      if (end.getTime() <= start.getTime())
        end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
      return { start, end };
    } catch {
      return null;
    }
  }

  function getShiftLabel(it: any) {
    if (!it?.startTime) return '';
    const h = new Date(it.startTime).getUTCHours();
    if (h >= 7 && h < 13) return 'Ca 1';
    if (h >= 13 && h < 19) return 'Ca 2';
    return 'Ca 3 (Đêm)';
  }

  const shiftLabel = getShiftLabel(item);
  const displayStartTime = formatTimeFromIso(item.startTime);
  const displayEndTime = formatTimeFromIso(item.endTime);
  const displayStartFull = formatDateTimeFromIso(item.startTime);
  const displayEndFull = formatDateTimeFromIso(item.endTime);

  async function handleConfirm() {
    setLoading(true);
    try {
      if (action === 'approve') {
        await approveScheduleAdmin(item.id);
      } else {
        await rejectScheduleAdmin(item.id);
      }
      onConfirm();
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.', error as any);
    }
    setLoading(false);
  }

  const se = getStartEnd(item);
  const now = new Date();
  const canModify = se ? se.start.getTime() > now.getTime() : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded shadow-lg w-96 p-4">
        <h3 className="text-lg font-medium mb-2">
          {action === 'approve' ? 'Duyệt lịch' : 'Hủy duyệt lịch'}
        </h3>
        <div className="text-sm text-gray-600 mb-4">
          <div className="text-sm font-medium mb-1">{`${shiftLabel} — ${displayStartTime} - ${displayEndTime}`}</div>
          <div className="text-xs text-gray-700">
            <span className="mr-4">
              Khoa:{' '}
              <span className="font-medium">
                {item.department?.name ?? '-'}
              </span>
            </span>
            <span>
              Phòng:{' '}
              <span className="font-medium">{item.room?.name ?? '-'}</span>
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Bắt đầu: <span className="font-medium">{displayStartFull}</span> ·
            Kết thúc: <span className="font-medium">{displayEndFull}</span>
          </div>
        </div>

        {!canModify && (
          <div className="mb-3 text-sm text-red-600">
            Không thể thao tác: ca đang diễn ra hoặc đã kết thúc.
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded border"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            className={`px-3 py-1 rounded ${action === 'approve' ? 'bg-primary text-white' : 'bg-red-50 text-red-600 border'}`}
            disabled={loading || !canModify}
            onClick={handleConfirm}
          >
            {loading
              ? 'Đang xử lý...'
              : action === 'approve'
                ? 'Duyệt'
                : 'Không duyệt'}
          </button>
        </div>
      </div>
    </div>
  );
}
