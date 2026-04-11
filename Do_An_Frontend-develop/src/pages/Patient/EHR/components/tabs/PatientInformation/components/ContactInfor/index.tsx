import { zodResolver } from '@hookform/resolvers/zod';
import CommonButton from '@src/components/CommonButton';
import CommonInput from '@src/components/CommonInput';
import { IRootState } from '@src/redux/store';
import { Pencil, Save, Undo } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import ApiPublicAddress from '@src/api/ApiPublicAddress';
import CommonAutoComplete from '@src/components/CommonAutoComplete';
import { ApiUser } from '@src/api/ApiUser';
import { toast } from 'react-toastify';
import { updateAuthStore } from '@src/redux/slices/AuthSlice';
import EmergencyContactSection from '../EmergencyContact';

const contactInformationSchema = z.object({
  address: z.object({
    detail: z.string().min(1, 'Địa chỉ chi tiết là bắt buộc'),
    ward: z.string().min(1, 'Phường/Xã là bắt buộc'),
    city: z.string().min(1, 'Tỉnh/Thành phố là bắt buộc'),
  }),
});

type ContactInformationForm = z.infer<typeof contactInformationSchema>;

export default function ContactInfor() {
  const { user } = useSelector((state: IRootState) => state.auth);
  const { patient } = useSelector((state: IRootState) => state.patient);
  const [isEditing, setIsEditing] = useState(false);
  const [provinceCode, setProvinceCode] = useState<string | null>(null);
  const [wardCode, setWardCode] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleCancelEditContact = () => {
    setIsEditing(false);
    reset({
      address: {
        detail: user?.address?.detail || '',
        ward: user?.address?.ward || '',
        city: user?.address?.city || '',
      },
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<ContactInformationForm>({
    resolver: zodResolver(contactInformationSchema),
    defaultValues: {
      address: {
        detail: user?.address?.detail || '',
        ward: user?.address?.ward || '',
        city: user?.address?.city || '',
      },
    },
  });

  const { data: provinces, isSuccess: isSuccessProvinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => ApiPublicAddress.getPublicProvinces(),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccessProvinces) {
      const selectedProvince = provinces?.provinces?.find((item) =>
        item.name.includes(user?.address?.city || '')
      );
      setProvinceCode(selectedProvince?.code || null);
    }
  }, [isSuccessProvinces]);

  const { data: wards, isSuccess: isSuccessWards } = useQuery({
    queryKey: ['wards', provinceCode],
    queryFn: () => ApiPublicAddress.getPublicWardsOfProvince(provinceCode!),
    enabled: !!provinceCode,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccessWards) {
      const selectedWard = wards?.communes?.find((item) =>
        item.name.includes(user?.address?.ward || '')
      );
      setWardCode(selectedWard?.code || null);
    }
  }, [isSuccessWards]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ContactInformationForm) => {
      return ApiUser.updateUser({
        address: {
          detail: data.address.detail,
          ward: data.address.ward,
          city: data.address.city,
          country: 'Việt Nam',
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

  const onSubmit = (data: ContactInformationForm) => {
    mutate(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Địa chỉ</h3>
        {!isEditing ? (
          <CommonButton
            text="Chỉnh sửa"
            onClick={() => setIsEditing(true)}
            startIcon={<Pencil size={16} />}
            className="!h-8 !px-3 !py-1"
            textClassName="!text-sm"
          />
        ) : (
          <div className="flex gap-2">
            <CommonButton
              text="Hủy"
              onClick={handleCancelEditContact}
              startIcon={<Undo size={16} />}
              className="!h-8 !px-3 !py-1"
              textClassName="!text-sm"
            />
            <CommonButton
              text="Lưu"
              color="#22c55e"
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
        <div className="grid grid-cols-2 gap-4"></div>

        <div>
          <CommonAutoComplete
            label="Tỉnh/Thành phố"
            options={
              provinces?.provinces?.map((item) => ({
                name: item.name,
                id: item.code.toString(),
              })) || []
            }
            value={{
              name: getValues('address.city') || '',
              id: provinceCode?.toString() || '',
            }}
            onChange={(value) => {
              setProvinceCode(value?.id || null);
              setValue('address.city', value?.name || '');
              setValue('address.ward', '');
              setWardCode(null);
            }}
            disabled={!isEditing}
            error={!!errors?.address?.city}
          />
          {errors?.address?.city && (
            <p className="text-red-500 text-xs mt-1">
              {errors.address.city.message}
            </p>
          )}
        </div>
        <div>
          <CommonAutoComplete
            label="Phường/Xã"
            options={
              wards?.communes?.map((item) => ({
                name: item.name,
                id: item.code.toString(),
              })) || []
            }
            value={{
              name: getValues('address.ward') || '',
              id: wardCode?.toString() || '',
            }}
            onChange={(value) => {
              setValue('address.ward', value?.name || '');
              setWardCode(value?.id || null);
            }}
            disabled={!isEditing}
            error={!!errors?.address?.ward}
          />
          {errors?.address?.ward && (
            <p className="text-red-500 text-xs mt-1">
              {errors.address.ward.message}
            </p>
          )}
        </div>
        <div>
          <CommonInput
            label="Địa chỉ chi tiết"
            {...register('address.detail')}
            readOnly={!isEditing}
            error={!!errors.address?.detail}
          />
          {errors.address?.detail && (
            <p className="text-red-500 text-xs mt-1">
              {errors.address.detail.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <EmergencyContactSection data={patient?.emergencyContacts} />
      </div>
    </div>
  );
}
