import DefaultAvatar from '@assets/images/default-avatar.jpg';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@src/redux/store';
import CommonButton from '@src/components/CommonButton';
import { Pencil, Save, Undo } from 'lucide-react';
import CommonInput from '@src/components/CommonInput';
import { CommonDestopDatePicker } from '@src/components/DatePicker';
import CommonSelect from '@src/components/CommonSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { EUserGender } from '@src/types';
import { useMutation } from '@tanstack/react-query';
import { ApiUser } from '@src/api/ApiUser';
import { toast } from 'react-toastify';
import { updateAuthStore } from '@src/redux/slices/AuthSlice';

const generalUserInforSchema = z.object({
  firstName: z.string().min(1, 'Họ là bắt buộc'),
  lastName: z.string().min(1, 'Tên là bắt buộc'),
  birthday: z.string().refine((val: string) => {
    const date = new Date(val);
    return date instanceof Date && !isNaN(date.getTime());
  }, 'Ngày sinh không hợp lệ'),
  gender: z.enum(['male', 'female', 'other']),
  citizen_id: z.string().min(1, 'Số CMND/CCCD là bắt buộc'),
  phone: z
    .string()
    .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số')
    .min(1, 'Số điện thoại là bắt buộc')
    .max(10, 'Số điện thoại không hợp lệ'),
  email: z.email('Email không hợp lệ'),
});

type GeneralUserInforForm = z.infer<typeof generalUserInforSchema>;

export default function GeneralInfor() {
  const [isEditing, setIsEditing] = useState(false);
  const genderOptions = [
    { id: 'male', name: 'Nam' },
    { id: 'female', name: 'Nữ' },
    { id: 'other', name: 'Khác' },
  ];
  const { user } = useSelector((state: IRootState) => state.auth);
  const { patient } = useSelector((state: IRootState) => state.patient);
  const dispatch = useDispatch();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    reset();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<GeneralUserInforForm>({
    resolver: zodResolver(generalUserInforSchema),
    defaultValues: {
      firstName: user?.name?.firstName || '',
      lastName: user?.name?.lastName || '',
      birthday: user?.birthday || '',
      gender: user?.gender || 'male',
      citizen_id: user?.citizen_id || '',
      phone: user?.phone || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    reset({
      firstName: user?.name?.firstName || '',
      lastName: user?.name?.lastName || '',
      birthday: user?.birthday || '',
      gender: user?.gender || 'male',
      citizen_id: user?.citizen_id || '',
      phone: user?.phone || '',
      email: user?.email || '',
    });
  }, [user, reset]);

  const onSubmit = (data: GeneralUserInforForm) => {
    mutate(data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: GeneralUserInforForm) => {
      const { firstName, lastName, ...rest } = data;
      return ApiUser.updateUser({
        ...rest,
        name: {
          firstname: firstName,
          lastname: lastName,
        },
      });
    },
    onSuccess: (value) => {
      toast.success('Cập nhật thông tin thành công');
      setIsEditing(false);
      dispatch(
        updateAuthStore({
          user: value,
        })
      );
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Thông tin cơ bản
        </h3>
        {!isEditing ? (
          <CommonButton
            text="Chỉnh sửa"
            onClick={handleEditClick}
            startIcon={<Pencil size={16} />}
            className="!h-8 !px-3 !py-1"
            textClassName="!text-sm"
          />
        ) : (
          <div className="flex gap-2">
            <CommonButton
              text="Hủy"
              onClick={handleCancelClick}
              startIcon={<Undo size={16} />}
              className="!h-8 !px-3 !py-1"
              textClassName="!text-sm"
            />
            <CommonButton
              color="#22c55e"
              text="Lưu"
              onClick={handleSubmit(onSubmit)}
              startIcon={<Save size={16} />}
              className="!h-8 !px-3 !py-1"
              textClassName="!text-sm"
              isLoading={isPending}
            />
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
            <img
              src={DefaultAvatar}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              {watch('firstName')} {watch('lastName')}
            </h4>
            <p className="text-gray-600">
              Mã bệnh nhân:{' '}
              <span className="font-medium text-gray-900">
                {patient?.patientId || '......'}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Ngày tạo:{' '}
              <span className="font-medium text-gray-900">15/01/2020</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <CommonInput
              label="Họ"
              {...register('firstName')}
              readOnly={!isEditing}
              error={!!errors?.firstName}
            />
            {errors?.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <CommonInput
              label="Tên"
              {...register('lastName')}
              readOnly={!isEditing}
              error={!!errors?.lastName}
            />
            {errors?.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Ngày sinh <span className="text-red-500 ml-1">*</span>
          </label>
          <CommonDestopDatePicker
            value={watch('birthday')}
            onChange={(date) =>
              setValue('birthday', date ? date.format('YYYY-MM-DD') : '')
            }
            className={!isEditing ? 'pointer-events-none opacity-70' : ''}
          />
          {errors?.birthday && (
            <p className="text-red-500 text-xs mt-1">
              {errors.birthday.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Giới tính <span className="text-red-500 ml-1">*</span>
          </label>
          <CommonSelect
            value={watch('gender')}
            onChange={(value) => setValue('gender', value as EUserGender)}
            values={genderOptions}
            placeholder="Chọn giới tính"
            selectProps={{ disabled: !isEditing }}
          />
          {errors?.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <CommonInput
            label="Số CMND/CCCD"
            {...register('citizen_id')}
            readOnly={!isEditing}
            error={!!errors?.citizen_id}
          />
          {errors?.citizen_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.citizen_id.message}
            </p>
          )}
        </div>
        <div>
          <CommonInput
            label="Số điện thoại"
            {...register('phone')}
            readOnly={!isEditing}
            error={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <CommonInput
            label="Email"
            type="email"
            {...register('email')}
            readOnly={!isEditing}
            error={!!errors.email}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
