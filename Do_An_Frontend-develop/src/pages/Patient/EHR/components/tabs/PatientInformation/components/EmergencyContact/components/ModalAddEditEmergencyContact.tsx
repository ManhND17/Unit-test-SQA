import { zodResolver } from '@hookform/resolvers/zod';
import ApiEmergencyContact from '@src/api/ApiEmergencyContact';
import CommonButton from '@src/components/CommonButton';
import CommonInput from '@src/components/CommonInput';
import CommonModal from '@src/components/Modal';
import { IEmergencyContact } from '@src/types';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

interface IFormEmergencyContactProps {
  open: boolean;
  onClose: () => void;
  data?: IEmergencyContact;
  onSuccess?: () => void;
  id: string;
}
const emergencyContactSchema = z.object({
  fullName: z.string().min(1, 'Họ và tên là bắt buộc'),
  relationship: z.string().min(1, 'Mối quan hệ là bắt buộc'),
  phone: z
    .string()
    .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số')
    .min(1, 'Số điện thoại là bắt buộc')
    .max(10, 'Số điện thoại không hợp lệ'),
  email: z.email('Email không hợp lệ').optional(),
});

type EmergencyContactDto = z.infer<typeof emergencyContactSchema>;

const ModalAddEditEmergencyContact = ({
  open,
  onClose,
  data,
  id,
  onSuccess,
}: IFormEmergencyContactProps) => {
  const isEditMode = !!data;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmergencyContactDto>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      fullName: data?.fullName || '',
      relationship: data?.relationship || '',
      phone: data?.phone || '',
      email: data?.email || '',
    },
  });

  const onSubmit = (data: EmergencyContactDto) => {
    mutate(data);
  };

  const { mutate } = useMutation({
    mutationFn: (formData: EmergencyContactDto) => {
      if (isEditMode) {
        return ApiEmergencyContact.updateEmergencyContact(id, formData);
      } else {
        return ApiEmergencyContact.addEmergencyContact(id, formData);
      }
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? 'Cập nhật người liên hệ khẩn cấp thành công'
          : 'Thêm người liên hệ khẩn cấp thành công'
      );
      onSuccess?.();
    },
  });

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={
        isEditMode
          ? 'Chỉnh sửa người liên hệ khẩn cấp'
          : 'Thêm người liên hệ khẩn cấp'
      }
    >
      <div>
        <div className="space-y-4">
          <div>
            <CommonInput
              label="Họ và tên"
              required={true}
              {...register('fullName')}
              error={!!errors?.fullName}
            />
            {errors?.fullName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <CommonInput
                label="Mối quan hệ"
                required={true}
                {...register('relationship')}
                error={!!errors?.relationship}
              />
              {errors?.relationship && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.relationship.message}
                </p>
              )}
            </div>
            <div>
              <CommonInput
                label="Số điện thoại"
                required={true}
                {...register('phone')}
                error={!!errors?.phone}
              />
              {errors?.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <CommonInput
              label="Email"
              required={false}
              {...register('email')}
              error={!!errors?.email}
            />
            {errors?.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
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

export default ModalAddEditEmergencyContact;
