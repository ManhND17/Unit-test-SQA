import { z } from 'zod';
import CommonInput from '@src/components/CommonInput';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@src/redux/store';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import CommonButton from '@src/components/CommonButton';
import { Pencil, Save, Undo } from 'lucide-react';
import ErrorMessage from '@src/components/ErrorMessage';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import ApiHealthInfor from '@src/api/ApiHealthInfor';
import { updatePatient } from '@src/redux/slices/PatientSlice';
import { toast } from 'react-toastify';

const healthInformationSchema = z.object({
  healthInfor: z.object({
    weight: z.number().min(0, 'Cân nặng phải lớn hơn 0').optional(),
    height: z.number().min(0, 'Chiều cao phải lớn hơn 0').optional(),
    bloodType: z.string().optional(),
    has_allergies: z.boolean().optional(),
    has_high_blood_pressure: z.boolean().optional(),
    has_diabetes: z.boolean().optional(),
    has_cancer: z.boolean().optional(),
  }),
});

type HealthInformationForm = z.infer<typeof healthInformationSchema>;

export default function HealthInfor() {
  const { patient } = useSelector((state: IRootState) => state.patient);
  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const dispatch = useDispatch();

  const handleCancelClick = () => {
    setIsEditing(false);
    reset();
  };

  const onSubmit = (data: HealthInformationForm) => {
    mutate(data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: HealthInformationForm) => {
      return ApiHealthInfor.updateHealthInfor(
        patient?.userId || '',
        data.healthInfor
      );
    },
    onSuccess: (value) => {
      dispatch(updatePatient({ healthInfo: value }));
      toast.success('Cập nhật thông tin thành công');
      setIsEditing(false);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<HealthInformationForm>({
    resolver: zodResolver(healthInformationSchema),
    defaultValues: {
      healthInfor: {
        weight: patient?.healthInfo?.weight,
        height: patient?.healthInfo?.height,
        bloodType: patient?.healthInfo?.bloodType,
        has_allergies: patient?.healthInfo?.has_allergies || false,
        has_high_blood_pressure:
          patient?.healthInfo?.has_high_blood_pressure || false,
        has_diabetes: patient?.healthInfo?.has_diabetes || false,
        has_cancer: patient?.healthInfo?.has_cancer || false,
      },
    },
  });

  useEffect(() => {
    reset({
      healthInfor: {
        weight: patient?.healthInfo?.weight,
        height: patient?.healthInfo?.height,
        bloodType: patient?.healthInfo?.bloodType,
        has_allergies: patient?.healthInfo?.has_allergies || false,
        has_high_blood_pressure:
          patient?.healthInfo?.has_high_blood_pressure || false,
        has_diabetes: patient?.healthInfo?.has_diabetes || false,
        has_cancer: patient?.healthInfo?.has_cancer || false,
      },
    });
  }, [patient, reset]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Thông tin y tế</h3>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <CommonInput
              value={watch('healthInfor.height')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue('healthInfor.height', Number(e.target.value))
              }
              readOnly={!isEditing}
              isRequired={false}
              label="Chiều cao (cm)"
            />

            <ErrorMessage message={errors.healthInfor?.height?.message} />
          </div>
          <div>
            <CommonInput
              value={watch('healthInfor.weight')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue('healthInfor.weight', Number(e.target.value))
              }
              readOnly={!isEditing}
              isRequired={false}
              label="Cân nặng (kg)"
            />
            <ErrorMessage message={errors.healthInfor?.weight?.message} />
          </div>
        </div>
        <div>
          <CommonInput
            type="text"
            {...register('healthInfor.bloodType')}
            readOnly={!isEditing}
            isRequired={false}
            label="Nhóm máu"
          />
          <ErrorMessage message={errors.healthInfor?.bloodType?.message} />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Tiền sử bệnh
          </label>
          <label className="flex items-center mr-4">
            <input
              className="w-4 h-4 mr-2"
              disabled={!isEditing}
              type="checkbox"
              {...register('healthInfor.has_allergies')}
            />
            Dị ứng
          </label>
          <label className="flex items-center mr-4">
            <input
              className="w-4 h-4 mr-2"
              disabled={!isEditing}
              type="checkbox"
              {...register('healthInfor.has_high_blood_pressure')}
            />
            Cao huyết áp
          </label>
          <label className="flex items-center mr-4">
            <input
              className="w-4 h-4 mr-2"
              disabled={!isEditing}
              type="checkbox"
              {...register('healthInfor.has_diabetes')}
            />
            Tiểu đường
          </label>
          <label className="flex items-center mr-4">
            <input
              className="w-4 h-4 mr-2"
              disabled={!isEditing}
              type="checkbox"
              {...register('healthInfor.has_cancer')}
            />
            Ung thư
          </label>
        </div>
      </div>
    </div>
  );
}
