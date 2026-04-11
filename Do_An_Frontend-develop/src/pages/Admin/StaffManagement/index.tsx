import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useDebounce from '@src/hooks/useDebounce';
import { IUser, EUserGender, EUserRole } from '@src/types';
import { StaffTable } from './components/StaffTable';
import { StaffFormModal } from './components/AddEditStaffFormModal';
import { ViewStaffModal } from './components/ViewStaffModal';
import { Search, Plus } from 'lucide-react';
import ApiAdminUser from '@src/api/ApiAdminUser';
import { toast } from 'react-toastify';
import CommonSelect from '@src/components/CommonSelect';

export default function StaffManagement() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<IUser | null>(null);
  const [editingStaff, setEditingStaff] = useState<IUser | null>(null);

  const staffData = useQuery({
    queryKey: ['staffUsers', page, limit, debouncedSearchQuery, filterRole],
    queryFn: async () => {
      const params: any = { page, limit };
      if (searchQuery) params.search = debouncedSearchQuery;
      if (filterRole && filterRole !== 'all') params.role = filterRole;
      return ApiAdminUser.getAllStaffs({ page, limit, ...params });
    },
    staleTime: 1000 * 60,
  });

  const statisticStaff = useQuery({
    queryKey: ['statisticStaff'],
    queryFn: async () => {
      return ApiAdminUser.statisticStaff();
    },
    staleTime: 1000 * 60,
  });

  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsFormModalOpen(true);
  };

  const handleEditStaff = (staff: IUser) => {
    setEditingStaff(staff);
    setIsFormModalOpen(true);
  };

  const handleViewStaff = (staff: IUser) => {
    setSelectedStaff(staff);
    setIsViewModalOpen(true);
  };

  const handleSubmitForm = async (formData: Partial<any>) => {
    if (editingStaff) {
      // Update existing staff
      const updatedStaff: any = {
        birthday: formData.birthday,
        gender: formData.gender,
        phone: formData.phone,
        address: {
          detail: formData.address?.detail,
          city: formData.address?.city,
          district: formData.address?.district,
          ward: formData.address?.ward,
          country: 'Vietnam',
        },
        name: {
          firstName: formData.name?.firstName,
          lastName: formData.name?.lastName,
        },
        staffData: {
          departmentId: formData.staff?.departmentId,
          position: formData.staff?.position,
          joinTime: formData.staff?.joinTime,
        },
      };
      if (formData.roleId === 2) {
        updatedStaff.doctorData = {
          specialization: formData.doctor?.specialization,
          licenseNumber: formData.doctor?.licenseNumber,
          experienceYears: formData.doctor?.experienceYears,
          level: formData.doctor?.level,
        };
      }
      try {
        if (formData.roleId === 3) {
          await ApiAdminUser.updateAdmin(editingStaff.id, updatedStaff);
        } else if (formData.roleId === 2) {
          await ApiAdminUser.updateDoctor(editingStaff.id, updatedStaff);
        }
        toast.success('Cập nhật nhân viên thành công');
      } catch (error) {
        toast.error('Có lỗi xảy ra khi cập nhật nhân viên');
      }
    } else {
      // Create new staff
      const newStaff: any = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        birthday: formData.birthday,
        gender: formData.gender || EUserGender.MALE,
        phone: formData.phone,
        name: {
          firstName: formData.name?.firstName,
          lastName: formData.name?.lastName,
        },
        staffData: {
          departmentId: formData.staff?.departmentId,
          position: formData.staff?.position,
          joinTime: formData.staff?.joinTime,
        },
        address: {
          detail: formData.address?.detail,
          city: formData.address?.city,
          district: formData.address?.district,
          ward: formData.address?.ward,
          country: 'Vietnam',
        },
      };
      if (formData.roleId === 2) {
        newStaff.doctorData = {
          specialization: formData.doctor?.specialization,
          licenseNumber: formData.doctor?.licenseNumber,
          experienceYears: formData.doctor?.experienceYears,
          level: formData.doctor?.level,
        };
      }
      try {
        if (formData.roleId === 3) {
          await ApiAdminUser.createAdmin(newStaff);
        } else if (formData.roleId === 2) {
          await ApiAdminUser.createDoctor(newStaff);
        }
        toast.success('Thêm nhân viên mới thành công');
      } catch (error) {
        toast.error('Có lỗi xảy ra khi thêm nhân viên mới');
      }
    }
    staffData.refetch();
    if (!editingStaff) statisticStaff.refetch();
    setIsFormModalOpen(false);
  };

  const stats = {
    total: statisticStaff.data?.total || 0,
    byRole: statisticStaff.data?.byRole || {},
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Quản lý Nhân viên
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý thông tin bác sĩ, quản trị viên và nhân viên y tế
            </p>
          </div>
          <button
            onClick={handleAddStaff}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Tổng nhân viên
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl text-blue-600">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Bác sĩ</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.byRole[EUserRole.DOCTOR] || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">👨‍⚕️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Quản trị viên</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.byRole[EUserRole.ADMIN] || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:justify-between">
          <div className="flex-1 relative max-w-[600px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
          <div className="flex items-center gap-2">
            <CommonSelect
              values={[
                { name: 'Tất cả vai trò', id: 'all' },
                { name: 'Bác sĩ', id: EUserRole.DOCTOR },
                { name: 'Quản trị viên', id: EUserRole.ADMIN },
                { name: 'Nhân viên', id: EUserRole.STAFF },
              ]}
              value={filterRole}
              onChange={(selected) => setFilterRole(selected)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <StaffTable
        staff={staffData.data?.data || []}
        onEdit={handleEditStaff}
        onViewDetails={handleViewStaff}
        page={page}
        limit={limit}
        totalItems={staffData.data?.metadata?.totalItems}
        totalPages={staffData.data?.metadata?.totalPages}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {/* Modals */}
      <StaffFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={editingStaff || undefined}
        title={editingStaff ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
      />

      <ViewStaffModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        staff={selectedStaff || undefined}
      />
    </div>
  );
}
