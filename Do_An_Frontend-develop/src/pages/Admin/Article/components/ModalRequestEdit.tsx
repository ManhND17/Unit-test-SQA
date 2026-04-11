import CommonModal from '@src/components/Modal';
import { IHealthArticle } from '@src/types';
import AutoCompleteAutofill, {
  IValue,
} from '@src/components/AutoCompleteAutofill';
import ApiAutofill from '@src/api/ApiAutofill';
import { useState } from 'react';
import { clsx } from 'clsx';
import CommonButton from '@src/components/CommonButton';
import { useMutation } from '@tanstack/react-query';
import ApiArticle from '@src/api/ApiArticle';
import { toast } from 'react-toastify';

interface ModalRequestEditProps {
  open: boolean;
  onClose: () => void;
  data: IHealthArticle;
  onSuccess?: () => void;
}

export default function ModalRequestEdit({
  open,
  onClose,
  data,
  onSuccess,
}: ModalRequestEditProps) {
  const [doctor, setDoctor] = useState<IValue | null>(() => {
    if (!data?.author) return null;
    const label = data.author.name
      ? `${data.author.name.firstName} ${data.author.name.lastName}`
      : data.author.username || '';
    return {
      id: data.author.id,
      label,
      avatar: data.author.avatar,
    };
  });

  const requestEditArticle = useMutation({
    mutationFn: (assigneeId: string) => {
      return ApiArticle.requestEditArticle(data.id, assigneeId);
    },
    onSuccess: () => {
      toast.success('Giao bài viết thành công');
      onSuccess?.();
      onClose();
    },
    onError: () => {
      toast.error('Giao bài viết thất bại');
    },
  });

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Yêu cầu chỉnh sửa bài viết"
    >
      <>
        <label>Giao cho</label>
        <AutoCompleteAutofill
          multiple={false}
          placeHolder={'Tìm bác sĩ...'}
          name="autofillDoctor"
          suggestionAPI={ApiAutofill.autoDoctor}
          value={doctor}
          onChange={(val) => {
            // Handle both object and string results
            if (!val) return setDoctor(null);
            if (Array.isArray(val)) {
              const first = val[0];
              if (!first) return setDoctor(null);
              if (typeof first === 'string')
                return setDoctor({ id: first, label: first });
              return setDoctor(first as IValue);
            }
            if (typeof val === 'string')
              return setDoctor({ id: val, label: val });
            return setDoctor(val as IValue);
          }}
          renderOption={(props, option: IValue) => {
            const isSelected = doctor?.id === option.id;
            return (
              <li
                {...props}
                className={clsx(
                  'w-full p-2 hover:cursor-pointer hover:bg-gray-200',
                  {
                    'bg-gray-300': isSelected,
                  }
                )}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={option.avatar || '/images/default-avatar.jpg'}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="truncate">{option.label}</span>
                </div>
              </li>
            );
          }}
          fallbackThumbnail="/images/default-avatar.jpg"
        />
        <div className="flex justify-end items-center gap-4 mt-6">
          <CommonButton text="Hủy" onClick={onClose} />
          <CommonButton
            isLoading={requestEditArticle.isPending}
            onClick={() => {
              if (!doctor) return;
              requestEditArticle.mutate(doctor.id);
            }}
            text="Xác nhận"
          />
        </div>
      </>
    </CommonModal>
  );
}
