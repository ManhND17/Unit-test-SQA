import ApiAppointment from '@src/api/ApiAppointment';
import CommonButton from '@src/components/CommonButton';
import CommonModal from '@src/components/Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface IModalCancelArticleProps {
  open: boolean;
  close: () => void;
  appointmentId?: string;
  onSuccess: () => void;
}

export default function ModalCancelAppointment({
  open,
  close,
  appointmentId,
  onSuccess,
}: IModalCancelArticleProps) {
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendCancel = async () => {
    if (!reason) {
      setError('Vui lòng nhập lý do hủy');
      return;
    }
    setIsLoading(true);
    if (!appointmentId) return;
    try {
      await ApiAppointment.cancelAppointment(appointmentId, { reason });
      toast.success('Hủy cuộc hẹn thành công');
      close();
      onSuccess();
    } catch (error) {
      toast.error('Hủy cuộc hẹn thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonModal title="Xác nhận hủy lịch hẹn" open={open} onClose={close}>
      <>
        <div>
          <label>Lý do hủy</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
            rows={4}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div className="flex justify-end items-center gap-4 mt-6">
          <CommonButton text="Hủy" onClick={close} />
          <CommonButton text="Xác nhận" onClick={handleSendCancel} />
        </div>
      </>
    </CommonModal>
  );
}
