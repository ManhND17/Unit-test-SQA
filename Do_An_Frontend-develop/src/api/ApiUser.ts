import { EUserGender, IUser } from 'src/types';
import { fetcher } from './Fetcher';

interface IChangePasswordResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

const getUser = () => {
  return fetcher<IUser>({
    url: '/users/profile',
    method: 'GET',
  });
};

type UpdateUserData = {
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
  citizen_id?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  address?: {
    detail: string;
    ward: string;
    city: string;
    country: string;
    district?: string;
  };
  name?: {
    firstname: string;
    lastname: string;
  };
};

const updateUser = (data: UpdateUserData) => {
  return fetcher<IUser>({
    url: `/users/profile`,
    method: 'PUT',
    data,
  });
};

const updateUserProfile = (data: {
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
}) => {
  const formData = new FormData();
  if (data.email) {
    formData.append('email', data.email);
  }
  if (data.birthday) {
    formData.append('birthday', data.birthday);
  }
  if (data.gender) {
    formData.append('gender', data.gender);
  }
  if (data.phone) {
    formData.append('phone', data.phone);
  }
  if (data.address) {
    formData.append('address', JSON.stringify(data.address));
  }
  if (data.name) {
    formData.append('name', JSON.stringify(data.name));
  }
  if (typeof data.avatar === 'string') {
    formData.append('avatar', data.avatar);
  } else if (data.avatar instanceof File) {
    formData.append('newAvatar', data.avatar);
  }

  return fetcher<IUser>(
    {
      url: '/users/profile',
      method: 'PUT',
      data: formData,
    },
    { isFormData: true }
  );
};

const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return fetcher<IChangePasswordResponse>({
    url: '/users/change-password',
    method: 'POST',
    data,
  });
};

export const ApiUser = {
  getUser,
  updateUser,
  updateUserProfile,
  changePassword,
};
