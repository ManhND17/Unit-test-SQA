import { useState } from 'react';
import { Building2, Stethoscope, Plus, RefreshCw, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ApiRoom from '@src/api/ApiRoom';
import ApiDepartment from '@src/api/ApiDepartment';
import ApiDoctor from '@src/api/ApiDoctor';
import Input from '@src/components/CommonInput';
import { RoomTable } from '@src/pages/Admin/RoomDepartment/components/RoomTable';
import { AddEditRoomModal } from '@src/pages/Admin/RoomDepartment/components/AddEditRoomModal';
import { DetailRoomModal } from '@src/pages/Admin/RoomDepartment/components/DetailRoomModal';
import { DeleteConfirm } from '@src/pages/Admin/RoomDepartment/components/DeleteConfirm';
import { DepartmentTable } from '@src/pages/Admin/RoomDepartment/components/DepartmentTable';
import { AddEditDepartmentModal } from '@src/pages/Admin/RoomDepartment/components/AddEditDepartmentModal';
import { DetailDepartmentModal } from '@src/pages/Admin/RoomDepartment/components/DetailDepartmentModal';
import { toast } from 'react-toastify';
import { IRoom, IDepartment, EDepartmentType } from '@src/types';
import useDebounce from '@src/hooks/useDebounce';

type TabType = 'buildings' | 'departments';

type DeptFormData = {
  name: string;
  description: string | null;
  code: string;
  phone?: string;
  type: EDepartmentType;
  headId?: string | null;
  roomId?: string;
  deputyIds?: string[] | null;
  thumbnail?: string;
  images?: string[] | null;
};

export default function RoomDepartmenttPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [buildingId, setBuildingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('buildings');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  // Room modals
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);
  const [isRoomViewOpen, setIsRoomViewOpen] = useState(false);
  const [isRoomDeleteOpen, setIsRoomDeleteOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
  const [roomFormMode, setRoomFormMode] = useState<'create' | 'edit'>('create');
  // Department modals
  const [isDeptFormOpen, setIsDeptFormOpen] = useState(false);
  const [isDeptViewOpen, setIsDeptViewOpen] = useState(false);
  const [isDeptDeleteOpen, setIsDeptDeleteOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<IDepartment | null>(null);
  const [deptFormMode, setDeptFormMode] = useState<'create' | 'edit'>('create');

  const databuilding = useQuery({
    queryKey: ['buildings'],
    queryFn: async () => {
      return ApiRoom.getRoomsByBuilding();
    },
    enabled: activeTab === 'buildings',
  });

  if (buildingId === null && databuilding.data?.data.length) {
    setBuildingId(databuilding.data?.data[0]?.id || null);
  }

  const availableRoomsQuery = useQuery({
    queryKey: ['availableRooms'],
    queryFn: async () => {
      return ApiRoom.getAvailableRooms();
    },
    staleTime: 1000 * 60 * 5,
  });

  const datarooms = useQuery({
    queryKey: ['rooms', page, limit, buildingId, debouncedSearchQuery],
    queryFn: async () => {
      const params: any = { page, limit };
      if (searchQuery) params.search = debouncedSearchQuery;
      if (buildingId) params.buildingId = buildingId;
      return ApiRoom.getRooms({ page, limit, ...params });
    },
    enabled: !!buildingId,
    staleTime: 1000 * 60,
  });

  const datadepartments = useQuery({
    queryKey: ['departments', page, limit, debouncedSearchQuery],
    queryFn: async () => {
      const params: any = { page, limit };
      if (searchQuery) params.search = debouncedSearchQuery;
      return ApiDepartment.getDepartments({ page, limit, ...params });
    },
    enabled: activeTab === 'departments',
    staleTime: 1000 * 60,
  });

  const datadoctors = useQuery({
    queryKey: ['doctors', page, limit],
    queryFn: async () => {
      return ApiDoctor.getDoctors({ page: 1, limit: 100 });
    },
  });

  const availableRooms: IRoom[] = availableRoomsQuery.data
    ? Array.isArray(availableRoomsQuery.data)
      ? availableRoomsQuery.data
      : ((availableRoomsQuery.data as any)?.data ?? [])
    : [];

  const filteredRooms: IRoom[] = datarooms.data
    ? Array.isArray(datarooms.data)
      ? datarooms.data
      : ((datarooms.data as any)?.data ?? [])
    : [];

  const filteredDepartments: IDepartment[] = datadepartments.data
    ? Array.isArray(datadepartments.data)
      ? datadepartments.data
      : ((datadepartments.data as any)?.departments ?? [])
    : [];

  const doctorsList = datadoctors.data
    ? Array.isArray(datadoctors.data.data)
      ? datadoctors.data.data
      : ((datadoctors.data as any)?.doctors ?? [])
    : [];

  const roomsMeta =
    (datarooms.data as any)?.metadata ?? (datarooms.data as any)?.meta ?? null;

  const deptsMeta =
    (datadepartments.data as any)?.pagination ??
    (datadepartments.data as any)?.meta ??
    null;

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const goToPage = (p: number) => {
    if (p < 1) return;
    if (roomsMeta && p > (roomsMeta.totalPages || 1)) return;
    if (deptsMeta && p > (deptsMeta.totalPages || 1)) return;
    setPage(p);
  };
  // Room handlers
  const handleCreateRoom = () => {
    setRoomFormMode('create');
    setSelectedRoom(null);
    setIsRoomFormOpen(true);
  };

  const handleViewRoom = (room: IRoom) => {
    setSelectedRoom(room);
    setIsRoomViewOpen(true);
  };

  const handleEditRoom = (room: IRoom) => {
    setSelectedRoom(room);
    setRoomFormMode('edit');
    setIsRoomFormOpen(true);
  };

  const handleDeleteRoom = (room: IRoom) => {
    setSelectedRoom(room);
    setIsRoomDeleteOpen(true);
  };

  const handleRoomSubmit = async (
    data: Omit<IRoom, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (roomFormMode === 'create') {
      const newRoom: any = {
        buildingId: data.buildingId || buildingId,
        name: data.name,
        numberRoom: data.number_room,
        floor: data.floor,
        type: data.type,
        status: data.status,
      };
      await ApiRoom.createRoom(newRoom);
      toast.success('Thêm phòng mới thành công!');
      datarooms.refetch();
    } else if (selectedRoom) {
      await ApiRoom.updateRoom(selectedRoom.id, data);
      toast.success('Cập nhật phòng thành công!');
      datarooms.refetch();
    }
  };

  const handleRoomDeleteConfirm = async () => {
    if (selectedRoom) {
      await ApiRoom.deleteRoom(selectedRoom.id);
      toast.success('Xóa phòng thành công!');
      setIsRoomDeleteOpen(false);
      datarooms.refetch();
    }
  };

  const handleCreateDept = () => {
    setDeptFormMode('create');
    setSelectedDept(null);
    setIsDeptFormOpen(true);
  };

  const handleViewDept = (dept: IDepartment) => {
    setSelectedDept(dept);
    setIsDeptViewOpen(true);
  };

  const handleEditDept = (dept: IDepartment) => {
    setSelectedDept(dept);
    setDeptFormMode('edit');
    setIsDeptFormOpen(true);
  };

  const handleDeleteDept = (dept: IDepartment) => {
    setSelectedDept(dept);
    setIsDeptDeleteOpen(true);
  };

  const handleDeptSubmit = async (data: DeptFormData) => {
    if (deptFormMode === 'create') {
      const newDept: any = {
        name: data.name,
        description: data.description ?? null,
        code: data.code,
        phone: data.phone,
        type: data.type,
        deputies: data.deputyIds
          ? data.deputyIds.map((id) => ({ userId: id }))
          : null,
        thumbnail: data.thumbnail ?? null,
        image: data.images ?? null,
        roomId: data.roomId,
        headId: data.headId,
      };
      await ApiDepartment.createDepartment(newDept);
      toast.success('Tạo khoa mới thành công!');
      datadepartments.refetch();
    } else if (selectedDept) {
      const newDept: any = {
        name: data.name,
        description: data.description ?? null,
        code: data.code,
        phone: data.phone,
        type: data.type,
        deputies: data.deputyIds
          ? data.deputyIds.map((id) => ({ userId: id }))
          : null,
        thumbnail: data.thumbnail ?? null,
        image: data.images ?? null,
        roomId: data.roomId,
        headId: data.headId,
      };
      await ApiDepartment.updateDepartment(selectedDept.id, newDept);
      toast.success('Cập nhật khoa thành công!');
      datadepartments.refetch();
    }
  };
  const handleDeptDeleteConfirm = async () => {
    if (selectedDept) {
      await ApiDepartment.deleteDepartment(selectedDept.id);
      toast.success('Xóa khoa thành công!');
      setIsDeptDeleteOpen(false);
      datadepartments.refetch();
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Quản lý Tòa nhà, Phòng & Khoa
          </h1>
          <p className="text-gray-600">
            Quản lý tập trung tòa nhà, phòng và khoa trong bệnh viện
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('buildings')}
            className={`px-4 py-3 font-medium text-sm transition-all relative ${activeTab === 'buildings' ? 'text-[#5B5FEF]' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <div className="flex items-center gap-2">
              <Building2 size={18} />
              <span>Tòa nhà & Phòng</span>
            </div>
            {activeTab === 'buildings' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B5FEF]"
                style={{
                  animation: 'slideIn 0.3s ease-out',
                }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-3 font-medium text-sm transition-all relative ${activeTab === 'departments' ? 'text-[#5B5FEF]' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <div className="flex items-center gap-2">
              <Stethoscope size={18} />
              <span>Khoa</span>
            </div>
            {activeTab === 'departments' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B5FEF]"
                style={{
                  animation: 'slideIn 0.3s ease-out',
                }}
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'buildings' ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Buildings List - Read Only */}
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Danh sách tòa nhà
                </h3>
                <div className="space-y-2">
                  {databuilding.data?.data?.map((building, index) => (
                    <button
                      key={building.id}
                      onClick={() => setBuildingId(building.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${buildingId === building.id ? 'bg-[#5B5FEF] text-white shadow-md' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'}`}
                      style={{
                        animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${buildingId === building.id ? 'bg-white/20' : 'bg-blue-100'}`}
                        >
                          <Building2
                            size={20}
                            className={
                              buildingId === building.id
                                ? 'text-white'
                                : 'text-blue-600'
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{building.name}</div>
                          <div
                            className={`text-sm ${buildingId === building.id ? 'text-white/80' : 'text-gray-500'}`}
                          >
                            {building.floorCount} tầng
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Rooms List - Full CRUD */}
            <div className="col-span-12 lg:col-span-9">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div className="flex-1 min-w-[300px] max-w-md">
                  <Input
                    icon={Search}
                    placeholder="Tìm kiếm phòng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => datarooms.refetch()}
                    className="px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                  >
                    <RefreshCw size={18} />
                    <span>Làm mới</span>
                  </button>
                  <button
                    onClick={handleCreateRoom}
                    className="px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 bg-[#5B5FEF] text-white hover:bg-[#4A4ED8]"
                  >
                    <Plus size={18} />
                    <span>Thêm phòng</span>
                  </button>
                </div>
              </div>

              <RoomTable
                rooms={filteredRooms}
                onView={handleViewRoom}
                onEdit={handleEditRoom}
                onDelete={handleDeleteRoom}
                page={page}
                limit={limit}
                totalPages={roomsMeta?.totalPages}
                totalItems={roomsMeta?.totalItems}
                onPageChange={goToPage}
                onLimitChange={handleLimitChange}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <Input
                  icon={Search}
                  placeholder="Tìm kiếm khoa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => datarooms.refetch()}
                  className="px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                >
                  <RefreshCw size={18} />
                  <span>Làm mới</span>
                </button>
                <button
                  onClick={handleCreateDept}
                  className="px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 bg-[#5B5FEF] text-white hover:bg-[#4A4ED8]"
                >
                  <Plus size={18} />
                  <span>Thêm khoa</span>
                </button>
              </div>
            </div>

            <DepartmentTable
              departments={filteredDepartments}
              onView={handleViewDept}
              onEdit={handleEditDept}
              onDelete={handleDeleteDept}
              page={page}
              limit={limit}
              totalPages={deptsMeta?.totalPages ?? 1}
              totalItems={deptsMeta?.totalItems ?? 0}
              onPageChange={goToPage}
              onLimitChange={handleLimitChange}
            />
          </div>
        )}
      </div>

      <AddEditRoomModal
        isOpen={isRoomFormOpen}
        onClose={() => setIsRoomFormOpen(false)}
        onSubmit={handleRoomSubmit as unknown as (...args: any[]) => void}
        room={selectedRoom as unknown as any}
        mode={roomFormMode}
        availableBuildings={databuilding.data?.data ?? []}
      />

      <DetailRoomModal
        isOpen={isRoomViewOpen}
        onClose={() => setIsRoomViewOpen(false)}
        room={selectedRoom as unknown as any}
      />

      <DeleteConfirm
        isOpen={isRoomDeleteOpen}
        onClose={() => setIsRoomDeleteOpen(false)}
        onConfirm={handleRoomDeleteConfirm}
        departmentName={selectedRoom?.name || ''}
      />

      <AddEditDepartmentModal
        isOpen={isDeptFormOpen}
        onClose={() => setIsDeptFormOpen(false)}
        onSubmit={handleDeptSubmit as unknown as (...args: any[]) => void}
        department={selectedDept as unknown as any}
        mode={deptFormMode}
        availableStaff={doctorsList}
        availableRooms={availableRooms}
      />

      <DetailDepartmentModal
        isOpen={isDeptViewOpen}
        onClose={() => setIsDeptViewOpen(false)}
        department={selectedDept}
      />

      <DeleteConfirm
        isOpen={isDeptDeleteOpen}
        onClose={() => setIsDeptDeleteOpen(false)}
        onConfirm={handleDeptDeleteConfirm}
        departmentName={selectedDept?.name || ''}
      />
    </>
  );
}
