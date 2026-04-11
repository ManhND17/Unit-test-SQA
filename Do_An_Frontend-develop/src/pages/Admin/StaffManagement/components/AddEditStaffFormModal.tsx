import React, { useState, useEffect } from 'react';
import {
  IUser,
  EUserGender,
  UserGenderLabels,
  IName,
  IAddress,
} from '@src/types';
import Modal from '@src/components/Modal';
import Input from '@src/components/CommonInput';
import { toast } from 'react-toastify';
import ApiDepartment from '@src/api/ApiDepartment';
import { useQuery } from '@tanstack/react-query';
import ApiPublicAddress, { IProvince, IWard } from '@src/api/ApiPublicAddress';
import { CircularProgress } from '@mui/material';

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (staff: Partial<IUser>) => Promise<void>;
  initialData?: IUser;
  title?: string;
}

const STAFF_ROLES = [
  { id: 2, name: 'doctor', label: 'Bác sĩ' },
  { id: 3, name: 'admin', label: 'Quản trị viên' },
];

export function StaffFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = 'Thêm nhân viên mới',
}: StaffFormModalProps) {
  const [formData, setFormData] = useState<Partial<IUser>>({
    username: '',
    email: '',
    phone: '',
    gender: EUserGender.MALE,
    roleId: 2,
    staff: {
      userId: '',
      staffId: '',
      departmentId: 1,
      position: '',
      joinTime: new Date().toISOString(),
      doctor: {
        userId: '',
        specialization: '',
        licenseNumber: '',
        experienceYears: 0,
        level: 'Bác sĩ',
      },
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState<IName>({
    userId: '',
    firstName: '',
    lastName: '',
  });

  const [address, setAddress] = useState<IAddress>({
    id: '',
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
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(1);

  const departments = useQuery({
    queryKey: ['departments'],
    queryFn: () => ApiDepartment.getDepartments({ page: 1, limit: 100 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await ApiPublicAddress.getPublicProvinces();
        setProvinces(response.provinces || []);
      } catch (error) {
        toast.error('Lỗi khi tải danh sách tỉnh/thành phố');
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
        toast.error('Lỗi khi tải danh sách quận/huyện, xã/phường');
        setWards([]);
      }
      setLoadingWards(false);
    };

    fetchWards();
  }, [selectedProvinceCode]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.name) {
        setName({
          userId: initialData.name.userId || '',
          firstName: initialData.name.firstName || '',
          lastName: initialData.name.lastName || '',
        });
      } else {
        setName({
          userId: '',
          firstName: initialData.username?.split(' ')[0] || '',
          lastName: initialData.username?.split(' ').slice(1).join(' ') || '',
        });
      }
      if (initialData.address) {
        setAddress(initialData.address);
        const province = provinces.find(
          (p) => p.name === initialData.address?.city
        );
        if (province) {
          setSelectedProvinceCode(province.code);
        }
      }
      if (initialData.staff?.departmentId) {
        setSelectedDepartmentId(initialData.staff.departmentId);
      }
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        phone: '',
        gender: EUserGender.MALE,
        roleId: 2,
        staff: {
          userId: '',
          staffId: '',
          departmentId: 1,
          position: 'Bác sĩ',
          joinTime: new Date().toISOString(),
          doctor: {
            userId: '',
            specialization: '',
            licenseNumber: '',
            experienceYears: 0,
            level: 'Bác sĩ',
          },
        },
      });
      setPassword('');
      setName({
        userId: '',
        firstName: '',
        lastName: '',
      });
      setAddress({
        id: '',
        detail: '',
        ward: '',
        district: '',
        city: '',
        country: 'Việt Nam',
      });
      setSelectedProvinceCode('');
      setSelectedDepartmentId(1);
    }
  }, [initialData, isOpen, provinces]);

  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'roleId'
          ? parseInt(value)
          : name === 'birthday'
            ? value
              ? new Date(value).toISOString()
              : null
            : value,
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setName((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStaffChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      staff: {
        ...prev.staff,
        userId: prev.id || '',
        staffId: prev.staff?.staffId || '',
        departmentId: prev.staff?.departmentId || selectedDepartmentId,
        position: prev.staff?.position || '',
        joinTime: prev.staff?.joinTime || new Date().toISOString(),
        [name]: name === 'joinTime' ? new Date(value).toISOString() : value,
      },
    }));
  };

  const handleDoctorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      staff: {
        ...prev.staff,
        doctor: {
          ...prev.staff?.doctor,
          userId: prev.id || '',
          experienceYears:
            name === 'experienceYears'
              ? parseInt(value) || 0
              : prev.staff?.doctor?.experienceYears || 0,
          [name]: name === 'experienceYears' ? parseInt(value) || 0 : value,
        },
      },
    }));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = parseInt(e.target.value);
    setSelectedDepartmentId(deptId);
    setFormData((prev) => ({
      ...prev,
      staff: {
        ...prev.staff,
        userId: prev.id || '',
        staffId: prev.staff?.staffId || '',
        departmentId: deptId,
        position: prev.staff?.position || '',
        joinTime: prev.staff?.joinTime || new Date().toISOString(),
      },
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullName = `${name.firstName} ${name.lastName}`.trim();

    const submitData: Partial<any> = {
      ...formData,
      username: formData.username || fullName,
      password: password,
      name: {
        firstName: name.firstName,
        lastName: name.lastName,
        userId: formData.id || '',
      },
      staff: {
        userId: formData.id || '',
        staffId: formData.staff?.staffId || '',
        departmentId: selectedDepartmentId,
        position: formData.staff?.position || '',
        joinTime: formData.staff?.joinTime || new Date().toISOString(),
      },
      address: {
        ...address,
        id: address.id || `addr_${Date.now()}`,
        country: address.country || 'Việt Nam',
      },
    };

    if (formData.roleId === 2) {
      submitData.doctor = {
        userId: formData.id || '',
        specialization: formData.staff?.doctor?.specialization,
        licenseNumber: formData.staff?.doctor?.licenseNumber,
        experienceYears: formData.staff?.doctor?.experienceYears || 0,
        level: formData.staff?.doctor?.level,
      };
    }

    await onSubmit(submitData);
    setIsSubmitting(false);
    onClose();
  };

  const isDoctor = formData.roleId === 2;

  return (
    <Modal open={isOpen} onClose={onClose} title={title}>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 max-h-[80vh] overflow-y-auto pr-2"
      >
        {/* User Information */}
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

          {!initialData && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input
                label="Tên đăng nhập "
                name="username"
                value={formData.username || ''}
                onChange={handleUserChange}
                required
                placeholder="Nhập tên đăng nhập"
                autoComplete="off"
              />
              <Input
                label="Mật khẩu "
                name="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                placeholder="Nhập mật khẩu"
                autoComplete="off"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò *
              </label>
              <select
                name="roleId"
                value={formData.roleId || 2}
                onChange={handleUserChange}
                disabled={!!initialData}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {STAFF_ROLES.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </select>
              {initialData && (
                <p className="text-xs text-gray-500 mt-1">
                  Vai trò không thể thay đổi
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Name Information */}
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
              placeholder="Chọn ngày sinh"
            />
          </div>
        </div>

        {/* Staff Information */}
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Thông tin nhân viên
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Vị trí"
              name="position"
              value={formData.staff?.position || ''}
              onChange={handleStaffChange}
              placeholder="Ví dụ: Bác sĩ, Trưởng khoa..."
            />
            <Input
              label="Ngày vào làm"
              name="joinTime"
              type="date"
              value={
                formData.staff?.joinTime
                  ? new Date(formData.staff.joinTime)
                      .toISOString()
                      .split('T')[0]
                  : new Date().toISOString().split('T')[0]
              }
              onChange={handleStaffChange}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoa/Phòng ban
            </label>
            <select
              value={selectedDepartmentId}
              onChange={handleDepartmentChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-10"
            >
              {departments.data?.departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address Information */}
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Địa chỉ</h3>

          {/* Province/City Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỉnh/Thành phố *
            </label>
            <select
              value={address.city}
              onChange={handleProvinceChange}
              disabled={loadingProvinces}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed max-h-10"
            >
              <option value="" className="truncate">
                {loadingProvinces ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
              </option>
              {provinces.map((province) => (
                <option key={province.code} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ward Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quận/Huyện, Xã/Phường *
            </label>
            <select
              value={address.ward}
              onChange={handleWardChange}
              disabled={loadingWards || !selectedProvinceCode}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed max-h-10"
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

          {/* Address Detail */}
          <div>
            <Input
              label="Địa chỉ chi tiết *"
              value={address.detail}
              onChange={handleAddressDetailChange}
              required
              placeholder="Ví dụ: 123 Đường ABC, Tòa nhà XYZ"
            />
          </div>
        </div>

        {/* Doctor Information - Only show if role is doctor */}
        {isDoctor && (
          <div className="border-b pb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Thông tin bác sĩ
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Chuyên khoa"
                name="specialization"
                value={formData.staff?.doctor?.specialization || ''}
                onChange={handleDoctorChange}
                placeholder="Ví dụ: Tim mạch, Nội khoa..."
                required={isDoctor}
              />
              <Input
                label="Số giấy phép"
                name="licenseNumber"
                value={formData.staff?.doctor?.licenseNumber || ''}
                onChange={handleDoctorChange}
                placeholder="Ví dụ: MD-901235"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input
                label="Số năm kinh nghiệm"
                name="experienceYears"
                type="number"
                min="0"
                value={
                  formData.staff?.doctor?.experienceYears?.toString() || '0'
                }
                onChange={handleDoctorChange}
                required={isDoctor}
              />

              <label className="text-sm font-medium text-gray-700">
                Cấp bậc
              </label>
              <select
                name="level"
                value={formData.staff?.doctor?.level || 'BSĐK'}
                onChange={handleDoctorChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BSĐK">Bác sĩ Đa khoa</option>
                <option value="BSNT">Bác sĩ Nội Trú</option>
                <option value="BSCK I">Bác sĩ CKI</option>
                <option value="BSCK II">Bác sĩ CKII</option>
                <option value="Ths">Thạc sĩ</option>
                <option value="TS">Tiến sĩ</option>
                <option value="PGS,TS">Phó Giáo sư, Tiến sĩ</option>
                <option value="GS,TS">Giáo sư, Tiến sĩ</option>
              </select>
            </div>
          </div>
        )}

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
