import React, { useState, useEffect } from 'react';
import { IUser, EUserGender, UserGenderLabels } from '@src/types';
import Modal from '@src/components/Modal';
import Input from '@src/components/CommonInput';
import { toast } from 'react-toastify';
import ApiPublicAddress, { IProvince, IWard } from '@src/api/ApiPublicAddress';
import { CircularProgress } from '@mui/material';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patient: Partial<IUser>) => Promise<void>;
  initialData?: IUser;
  title?: string;
}

interface Name {
  firstName: string;
  lastName: string;
}

interface Address {
  id?: string;
  detail: string;
  ward: string;
  district?: string;
  city: string;
  country?: string;
}

export function PatientFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = 'Thêm bệnh nhân mới',
}: PatientFormModalProps) {
  const [formData, setFormData] = useState<Partial<IUser>>({
    username: '',
    email: '',
    password: '',
    phone: '',
    gender: EUserGender.MALE,
    birthday: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState<Name>({
    firstName: '',
    lastName: '',
  });

  const [address, setAddress] = useState<Address>({
    detail: '',
    ward: '',
    district: '',
    city: '',
    country: 'Việt Nam',
  });

  const [password, setPassword] = useState<string>('');

  // Address API states
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>('');

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await ApiPublicAddress.getPublicProvinces();
        setProvinces(response.provinces || []);
      } catch (error) {
        toast.error('Lỗi tải danh sách tỉnh/thành phố');
        setProvinces([]);
      }
      setLoadingProvinces(false);
    };

    if (isOpen) {
      fetchProvinces();
    }
  }, [isOpen]);

  // Fetch wards when province changes
  useEffect(() => {
    const fetchWards = async () => {
      if (selectedProvinceCode === '') {
        setWards([]);
        return;
      }

      setLoadingWards(true);
      try {
        const response =
          await ApiPublicAddress.getPublicWardsOfProvince(selectedProvinceCode);
        setWards(response.communes || []);
      } catch (error) {
        toast.error('Lỗi tải danh sách quận/huyện, xã/phường');
        setWards([]);
      }
      setLoadingWards(false);
    };

    fetchWards();
  }, [selectedProvinceCode]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Parse name từ initialData
      if (initialData.name) {
        setName({
          firstName: initialData.name.firstName || '',
          lastName: initialData.name.lastName || '',
        });
      } else {
        const parts = initialData.username?.split(' ') || [];
        setName({
          firstName: parts[0] || '',
          lastName: parts.slice(1).join(' ') || '',
        });
      }
      // Set address từ initialData
      if (initialData.address) {
        setAddress(initialData.address);
        // Find province code từ initial data
        const province = provinces.find(
          (p) => p.name === initialData.address?.city
        );
        if (province) {
          setSelectedProvinceCode(province.code);
        }
      }
    } else {
      setFormData({
        username: '',
        email: '',
        password: '', // thêm dòng này
        phone: '',
        gender: EUserGender.MALE,
        birthday: undefined,
      });
      setPassword(''); // thêm dòng này
      setName({
        firstName: '',
        lastName: '',
      });
      setAddress({
        detail: '',
        ward: '',
        district: '',
        city: '',
        country: 'Việt Nam',
      });
      setSelectedProvinceCode('');
    }
  }, [initialData, isOpen, provinces]);

  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'birthday' ? new Date(value) : value,
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setName((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    const province = provinces.find((p) => p.name === selectedCity);

    setAddress((prev) => ({
      ...prev,
      city: selectedCity,
      ward: '',
      district: '',
    }));

    setSelectedProvinceCode(province?.code || '');
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWard = e.target.value;

    setAddress((prev) => ({
      ...prev,
      ward: selectedWard,
    }));
  };

  const handleAddressDetailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setAddress((prev) => ({
      ...prev,
      detail: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }; // 4. Thêm handler cho password

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    e.preventDefault();

    // Combine full name for username if not provided
    const fullName = `${name.firstName} ${name.lastName}`.trim();

    const submitData: Partial<IUser> = {
      ...formData,
      username: formData.username || fullName,
      password: password, // thêm dòng này
      name: {
        firstName: name.firstName,
        lastName: name.lastName,
        userId: formData.id || '',
      },
      address: {
        ...address,
        id: address.id || `addr_${Date.now()}`,
        country: 'Việt Nam',
      },
    };

    await onSubmit(submitData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={title}>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 max-h-[80vh] overflow-y-auto pr-2"
      >
        {!initialData && (
          <div className="border-b pb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Thông tin đăng nhập
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tên đăng nhập"
                name="username"
                value={formData.username || ''}
                onChange={handleUserChange}
                required
                placeholder="Nhập tên đăng nhập"
                autoComplete="off"
              />
              <Input
                label="Mật khẩu"
                name="password"
                type="password"
                showPassword
                value={password}
                onChange={handlePasswordChange}
                required
                placeholder="Nhập mật khẩu"
                autoComplete="new-password"
              />
            </div>
          </div>
        )}
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleUserChange}
              required
              placeholder="Nhập email"
              disabled={!!initialData}
            />
            <Input
              label="Số điện thoại"
              name="phone"
              value={formData.phone || ''}
              onChange={handleUserChange}
              placeholder="Nhập SĐT"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input
              label="Ngày sinh"
              name="birthday"
              type="date"
              value={
                formData.birthday
                  ? new Date(formData.birthday).toISOString().split('T')[0]
                  : ''
              }
              onChange={handleUserChange}
            />

            <label className="block text-base font-medium text-gray-700 mb-2">
              Giới tính
            </label>
            <select
              name="gender"
              value={formData.gender || EUserGender.MALE}
              onChange={handleUserChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(UserGenderLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Thông tin cá nhân
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Họ"
              name="firstName"
              value={name.firstName}
              onChange={handleNameChange}
              required
              placeholder="Nhập họ"
            />
            <Input
              label="Tên"
              name="lastName"
              value={name.lastName}
              onChange={handleNameChange}
              required
              placeholder="Nhập tên"
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Địa chỉ</h3>

          {/* Province/City Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </label>
            <select
              value={address.city}
              onChange={handleProvinceChange}
              disabled={loadingProvinces}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingProvinces ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
              </option>
              {provinces.map((province) => (
                <option key={province.code} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quận/Huyện, Xã/Phường <span className="text-red-500">*</span>
            </label>
            <select
              value={address.ward}
              onChange={handleWardChange}
              disabled={loadingWards || !selectedProvinceCode}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {!selectedProvinceCode
                  ? 'Vui lòng chọn tỉnh trước'
                  : loadingWards
                    ? 'Đang tải...'
                    : 'Chọn quận/huyện, xã/phường'}
              </option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.name}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Input
              label="Địa chỉ chi tiết"
              value={address.detail}
              onChange={handleAddressDetailChange}
              required
              placeholder="Ví dụ: 123 Đường ABC, Tòa nhà XYZ"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            disabled={isSubmitting}
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {initialData ? 'Cập nhật' : 'Thêm'}{' '}
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : ''}
          </button>
        </div>
      </form>
    </Modal>
  );
}
