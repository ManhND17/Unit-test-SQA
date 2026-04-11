import ApiContact from '@src/api/ApiContact';
import CommonButton from '@src/components/CommonButton';
import CommonModal from '@src/components/Modal';
import { IContact } from '@src/types';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface IModalReplyProps {
  open: boolean;
  onClose: () => void;
  data: IContact;
  refetch?: () => void;
}

export default function ModalReply({
  open,
  onClose,
  data,
  refetch,
}: IModalReplyProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string>('');

  const handleReply = () => {
    const replyContent = textAreaRef.current?.value.trim() || '';
    if (!replyContent) {
      setError('Nội dung hồi đáp là bắt buộc');
      return;
    }

    mutate({ value: replyContent });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (message: { value: string }) =>
      ApiContact.replyContact(data.id, message.value),
    onSuccess: () => {
      onClose();
      toast.success('Hồi đáp thành công');
      setError('');
      refetch?.();
    },
  });

  return (
    <CommonModal title="Phản hồi khách hàng" open={open} onClose={onClose}>
      <>
        <div className="flex flex-col gap-3">
          <label htmlFor="reply" className="font-medium">
            Phản hồi của bạn:
          </label>
          <textarea
            ref={textAreaRef}
            id="reply"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập nội dung hồi đáp..."
          ></textarea>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <CommonButton text="Hủy" onClick={onClose} />
          <CommonButton
            disabled={isPending}
            isLoading={isPending}
            text="Phản hồi"
            onClick={handleReply}
          />
        </div>
      </>
    </CommonModal>
  );
}
