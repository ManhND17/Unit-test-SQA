import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useDebounce from '@src/hooks/useDebounce';
import ApiAdminUser from '@src/api/ApiAdminUser';
import { IUser, EUserGender } from '@src/types';
import { PatientTable } from './components/PatientTable';
import { PatientFormModal } from './components/AddEditPatient';
import { ViewPatientModal } from './components/ViewPatientModal';
import { Search, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

export default function PatientManagement() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<IUser | null>(null);
  const [editingPatient, setEditingPatient] = useState<IUser | null>(null);

  const patientData = useQuery({
    queryKey: ['patientUsers', page, limit, debouncedSearchQuery],
    queryFn: async () => {
      const params: any = { page, limit };
      if (searchQuery) params.search = debouncedSearchQuery;
      return ApiAdminUser.getAllPatients({ page, limit, ...params });
    },
  });

  const patientStats = useQuery({
    queryKey: ['patientStats'],
    queryFn: () => ApiAdminUser.statisticPatient(),
  });

  const handleAddPatient = () => {
    setEditingPatient(null);
    setIsFormModalOpen(true);
  };

  const handleEditPatient = (patient: IUser) => {
    setEditingPatient(patient);
    setIsFormModalOpen(true);
  };

  const handleViewPatient = (patient: IUser) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const handleSubmitForm = async (formData: Partial<IUser>) => {
    if (editingPatient) {
      // Update existing patient
      const updatedPatient: any = {
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
      };
      await ApiAdminUser.updatePatient(editingPatient.id, updatedPatient);
      toast.success('Cập nhật thông tin bệnh nhân thành công');
    } else {
      // Create new patient
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
        address: {
          detail: formData.address?.detail,
          city: formData.address?.city,
          district: formData.address?.district,
          ward: formData.address?.ward,
          country: 'Vietnam',
        },
      };
      await ApiAdminUser.createPatient(newStaff);
      toast.success('Thêm bệnh nhân mới thành công');
    }
    patientData.refetch();
    if (!editingPatient) patientStats.refetch();
    setIsFormModalOpen(false);
  };

  const stats = {
    total: patientStats.data?.total || 0,
    withHealthInsurance: patientStats.data?.withHealthInsurance || 0,
    withEHR: patientStats.data?.withEHR || 0,
    withAppointment: patientStats.data?.withAppointment || 0,
    byGender: patientStats.data?.byGender || {},
    ageGroups: patientStats.data?.ageGroups || {},
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Quản lý Bệnh nhân
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý thông tin và lịch sử khám bệnh của bệnh nhân
            </p>
          </div>
          <button
            onClick={handleAddPatient}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Thêm bệnh nhân
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Tổng bệnh nhân
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🏥</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Có bảo hiểm y tế
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.withHealthInsurance}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📑</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Giới tính</p>
              <div className="flex gap-4">
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  Nam: {stats.byGender.male || 0}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  Nữ: {stats.byGender.female || 0}
                </p>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">👱</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, SĐT hoặc ID bệnh nhân..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <PatientTable
        patients={patientData.data?.data || []}
        onEdit={handleEditPatient}
        onViewDetails={handleViewPatient}
        page={page}
        limit={limit}
        totalItems={patientData.data?.metadata?.totalItems}
        totalPages={patientData.data?.metadata?.totalPages}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {/* Modals */}
      <PatientFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={editingPatient || undefined}
        title={editingPatient ? 'Cập nhật bệnh nhân' : 'Thêm bệnh nhân mới'}
      />

      <ViewPatientModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        patient={selectedPatient || undefined}
      />
    </div>
  );
}
