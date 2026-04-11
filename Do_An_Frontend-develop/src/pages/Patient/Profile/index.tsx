import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { IRootState } from '@redux/store';
import { EUserGender } from 'src/types';
import CommonInput from '@components/CommonInput';
import { ApiUser } from '@api/ApiUser';
import { tryCatch } from '@utils/handleError';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  UploadCloud,
  Globe,
} from 'lucide-react';
import { updateUser } from '@redux/slices/AuthSlice';
import CommonSelect from '@src/components/CommonSelect';
import Badge from '@src/components/CommonBadge';

interface IProfileFormData {
  avatar: string;
  birthday: string;
  gender: EUserGender;
  email: string;
  phone: string;
  address: {
    detail: string;
    ward: string;
    district: string;
    city: string;
    country: string;
  };
  name: {
    firstname: string;
    lastname: string;
  };
}

const Profile = () => {
  const { user } = useSelector((state: IRootState) => state.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user?.avatar || ''
  );
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<File | null>(null);

  const { register, handleSubmit, setValue, watch } = useForm<IProfileFormData>(
    {
      defaultValues: {
        avatar: '',
        birthday: '',
        gender: EUserGender.MALE,
        email: '',
        phone: '',
        address: {
          detail: '',
          ward: '',
          district: '',
          city: '',
          country: 'Việt Nam',
        },
        name: {
          firstname: '',
          lastname: '',
        },
      },
    }
  );

  useEffect(() => {
    if (user) {
      setValue('avatar', user.avatar || '');
      setValue(
        'birthday',
        user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : ''
      );
      setValue('gender', user.gender);
      setValue('phone', user.phone || '');
      setValue('address.detail', user?.address?.detail || '');
      setValue('address.ward', user?.address?.ward || '');
      setValue('address.district', user?.address?.district || '');
      setValue('address.city', user?.address?.city || '');
      setValue('address.country', user?.address?.country || 'Việt Nam');
      setValue('name.firstname', user.name?.firstName || '');
      setValue('name.lastname', user.name?.lastName || '');
      setValue('email', user.email || '');
    }
  }, [user, setValue]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 2MB');
        return;
      }
      setAvatarPreview(URL.createObjectURL(file));
      avatarFileRef.current = file;
    }
  };

  const handleAvatarButtonClick = () => {
    avatarInputRef.current?.click();
  };

  const onSubmit = async (data: IProfileFormData) => {
    setIsLoading(true);

    const updateData: {
      email?: string;
      birthday?: string;
      gender: EUserGender;
      phone: string;
      address: {
        detail: string;
        ward: string;
        district: string;
        city: string;
        country: string;
      };
      name: {
        firstname: string;
        lastname: string;
      };
      avatar?: File | string;
    } = {
      birthday: data.birthday || undefined,
      gender: data.gender,
      phone: data.phone,
      email: data.email || undefined,
      address: {
        detail: data.address.detail,
        ward: data.address.ward,
        district: data.address.district,
        city: data.address.city,
        country: data.address.country,
      },
      name: {
        firstname: data.name.firstname,
        lastname: data.name.lastname,
      },
    };

    if (avatarFileRef.current) {
      updateData.avatar = avatarFileRef.current;
    }

    if (typeof data.avatar === 'string' && data.avatar !== user?.avatar) {
      updateData.avatar = data.avatar;
    }

    const [res, err] = await tryCatch(ApiUser.updateUserProfile(updateData));
    if (err) {
      toast.error(err.errorMessage || 'Cập nhật thông tin thất bại');
    } else if (res) {
      toast.success('Cập nhật thông tin thành công');
      dispatch(updateUser(res));
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Thông tin cá nhân
        </h3>
        <Badge>
          {user?.role.name === 'patient'
            ? 'Bệnh nhân'
            : user?.role.name === 'doctor'
              ? 'Bác sĩ'
              : user?.role.name === 'admin'
                ? 'Quản trị viên'
                : 'Không xác định'}
        </Badge>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8">
          {/* Avatar Section */}
          <div className="border-b border-gray-200 pb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src={avatarPreview || '/images/default-avatar.jpg'}
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 shadow-sm"
              />
              <input
                type="file"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleAvatarChange}
                className="hidden"
                ref={avatarInputRef}
              />
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAvatarButtonClick}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UploadCloud className="w-4 h-4" />
                    {user?.avatar ? 'Cập nhật ảnh' : 'Tải ảnh lên'}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  JPG, PNG hoặc GIF. Kích thước tối đa 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Thông tin liên hệ
            </h2>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <CommonInput
                    label="Họ"
                    {...register('name.firstname', {
                      required: 'Họ không được để trống',
                    })}
                    icon={User}
                  />
                </div>
                <div className="flex-1">
                  <CommonInput
                    label="Tên"
                    {...register('name.lastname', {
                      required: 'Tên không được để trống',
                    })}
                    icon={User}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <CommonInput
                    label="Email"
                    value={user?.email || ''}
                    icon={Mail}
                  />
                </div>
                <div className="flex-1">
                  <CommonInput
                    label="Số điện thoại"
                    {...register('phone')}
                    icon={Phone}
                    placeholder="Chưa cập nhật"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <CommonInput
                    label="Ngày sinh"
                    type="date"
                    {...register('birthday')}
                    icon={Calendar}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-2">
                    Giới tính <span className="text-red-500 ml-1">*</span>
                  </label>
                  <CommonSelect
                    values={[
                      { name: 'Nam', id: 'male' },
                      { name: 'Nữ', id: 'female' },
                      { name: 'Khác', id: 'other' },
                    ]}
                    value={watch('gender')}
                    onChange={(value) =>
                      setValue('gender', value as EUserGender)
                    }
                    className="h-[52px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Địa chỉ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <CommonInput
                  label="Địa chỉ chi tiết"
                  {...register('address.detail')}
                  icon={MapPin}
                  placeholder="Số nhà, tên đường..."
                />
              </div>
              <CommonInput
                label="Phường/Xã"
                {...register('address.ward')}
                placeholder="Chưa cập nhật"
              />
              <CommonInput
                label="Quận/Huyện"
                {...register('address.district')}
                placeholder="Chưa cập nhật"
              />
              <CommonInput
                label="Tỉnh/Thành phố"
                {...register('address.city')}
                placeholder="Chưa cập nhật"
              />
              <CommonInput
                label="Quốc gia"
                {...register('address.country')}
                icon={Globe}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50"
            >
              <Save className="w-5 h-5" />
              {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
