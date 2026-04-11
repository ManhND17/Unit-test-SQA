import { zodResolver } from '@hookform/resolvers/zod';
import ApiHealthInsurance from '@src/api/ApiHealthInsurance';
import CommonButton from '@src/components/CommonButton';
import CommonInput from '@src/components/CommonInput';
import { CommonDestopDatePicker } from '@src/components/DatePicker';
import CommonModal from '@src/components/Modal';
import { IHealthInsurance } from '@src/types';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const healthInsuranceSchema = z.object({
  type: z.string().min(1, 'Loại bảo hiểm không được để trống'),
  insuranceId: z.string().min(1, 'Mã bảo hiểm không được để trống'),
  startAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Ngày bắt đầu không hợp lệ',
  }),
  endAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Ngày kết thúc không hợp lệ',
  }),
  level_of_benefit: z
    .number()
    .min(0, 'Mức độ quyền lợi không hợp lệ')
    .max(5, 'Mức độ quyền lợi không hợp lệ')
    .optional()
    .nullable(),
  province_code: z
    .string()
    .min(1, 'Mã tỉnh không được để trống')
    .optional()
    .nullable(),
  initial_kcb_code: z
    .string()
    .min(1, 'Mã KCB ban đầu không được để trống')
    .optional()
    .nullable(),
  initial_kcb_name: z
    .string()
    .min(1, 'Tên KCB ban đầu không được để trống')
    .optional()
    .nullable(),
});

type HealthInsuranceDto = z.infer<typeof healthInsuranceSchema>;

interface IModalAddEditHealthInsuranceProps {
  open: boolean;
  onClose: () => void;
  data?: IHealthInsurance;
  onSuccess?: () => void;
  id: string;
}

export const ModalAddEditHealthInsurance = ({
  open,
  onClose,
  data,
  id,
  onSuccess,
}: IModalAddEditHealthInsuranceProps) => {
  const isEditMode = !!data;
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<HealthInsuranceDto>({
    resolver: zodResolver(healthInsuranceSchema),
    defaultValues: {
      type: data?.type || '',
      insuranceId: data?.insuranceId || '',
      startAt: data?.startAt || '',
      endAt: data?.endAt || '',
      initial_kcb_name: data?.initial_kcb_name || '',
    },
  });

  const onSubmit = (data: HealthInsuranceDto) => {
    mutate(data);
  };

  const { mutate } = useMutation({
    mutationFn: (formData: HealthInsuranceDto) => {
      if (isEditMode) {
        return ApiHealthInsurance.updateHealthInsurance(id, formData);
      } else {
        return ApiHealthInsurance.addHealthInsurance(id, formData);
      }
    },
    onSuccess: () => {
      toast.success(
        isEditMode ? 'Cập nhật bảo hiểm thành công' : 'Thêm bảo hiểm thành công'
      );
      onSuccess?.();
    },
  });

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={isEditMode ? 'Chỉnh sửa bảo hiểm y tế' : 'Thêm bảo hiểm y tế'}
    >
      <div>
        <div className="space-y-4">
          <div>
            <CommonInput
              label="Loại bảo hiểm"
              required={true}
              {...register('type')}
              error={!!errors?.type}
            />
            {errors?.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
            )}
          </div>
          <div>
            <CommonInput
              label="Số thẻ BHYT"
              required={true}
              {...register('insuranceId')}
              error={!!errors?.insuranceId}
            />
            {errors?.insuranceId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.insuranceId.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Có hiệu lực từ <span className="text-red-500 ml-1">*</span>
              </label>
              <CommonDestopDatePicker
                value={watch('startAt')}
                onChange={(date) =>
                  setValue('startAt', date ? date.format('YYYY-MM-DD') : '')
                }
              />
              {errors?.startAt && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startAt.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Có hiệu lực đến <span className="text-red-500 ml-1">*</span>
              </label>
              <CommonDestopDatePicker
                value={watch('endAt')}
                onChange={(date) =>
                  setValue('endAt', date ? date.format('YYYY-MM-DD') : '')
                }
              />
              {errors?.endAt && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.endAt.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <CommonInput
              label="Nơi đăng ký KCB ban đầu"
              {...register('initial_kcb_name')}
            />
          </div>
          <div className="flex justify-end gap-4">
            <CommonButton text="Hủy" onClick={onClose} />
            <CommonButton
              color="#22c55e"
              text="Lưu"
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </div>
    </CommonModal>
  );
};
