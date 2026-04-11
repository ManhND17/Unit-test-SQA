import { useState } from 'react';
import Modal from '@src/components/Modal';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  departmentName: string;
}
export function DeleteConfirm({
  isOpen,
  onClose,
  onConfirm,
  departmentName,
}: DeleteConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleConfirm = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    onConfirm();
    setIsDeleting(false);
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Xác nhận xóa khoa">
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} className="text-red-600" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Bạn có chắc chắn muốn xóa?
        </h3>

        <p className="text-gray-600 mb-1">
          Khoa{' '}
          <span className="font-semibold text-gray-900">
            "{departmentName}"
          </span>{' '}
          sẽ bị xóa vĩnh viễn.
        </p>

        <p className="text-sm text-red-600 mb-6">
          Hành động này không thể hoàn tác!
        </p>

        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 min-w-[120px] disabled:opacity-60"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xóa...
              </span>
            ) : (
              'Xác nhận xóa'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
