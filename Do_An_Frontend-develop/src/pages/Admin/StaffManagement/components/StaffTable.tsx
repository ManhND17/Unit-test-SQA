import { IUser, UserRoleLabels } from '@src/types';
import { Eye, Edit2 } from 'lucide-react';
import CommonTable, { CommonTableColumn } from '@src/components/CommonTable';
import { IconButton } from '@mui/material';

interface StaffTableProps {
  staff: IUser[];
  onEdit: (staff: IUser) => void;
  onDelete?: (staff: IUser) => void;
  onViewDetails: (staff: IUser) => void;
  // pagination props
  page?: number;
  limit?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (p: number) => void;
  onLimitChange?: (n: number) => void;
}

interface IStaffRow {
  id: string;
  avatar: string;
  username: string;
  email: string;
  phone?: string | null;
  role: string;
  createdAt: string;
  original: IUser;
}

export function StaffTable({
  staff,
  onEdit,
  onViewDetails,
  page = 1,
  limit = 10,
  totalItems,
  onPageChange,
  onLimitChange,
}: StaffTableProps) {
  const tableRows: IStaffRow[] = staff.map((member: IUser) => ({
    id: member.id,
    avatar: member.avatar,
    username: member.username,
    email: member.email,
    phone: member.phone,
    role: member.role.name,
    createdAt: member.createdAt,
    original: member,
  }));

  const columns: CommonTableColumn<IStaffRow>[] = [
    {
      field: 'username',
      headerName: 'Nhân viên',
      width: 250,
      renderCell: ({ row }) => (
        <div className="w-full h-full flex items-center">
          <div className="flex items-center gap-3">
            <img
              src={row.avatar || '/default-avatar.png'}
              alt={row.username}
              className="h-10 w-10 rounded-full object-cover"
            />
            <p className="font-medium text-gray-900">{`${row.original.name?.firstName} ${row.original.name?.lastName}`}</p>
          </div>
        </div>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="text-sm text-gray-600">{value}</p>
        </div>
      ),
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="text-sm text-gray-600">{value || '-'}</p>
        </div>
      ),
    },
    {
      field: 'role',
      headerName: 'Vai trò',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              value === 'admin'
                ? 'bg-red-100 text-red-800'
                : value === 'doctor'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
            }`}
          >
            {UserRoleLabels[value as keyof typeof UserRoleLabels] || value}
          </span>
        </div>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tham gia',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="text-sm text-gray-600">
            {new Date(value).toLocaleDateString('vi-VN')}
          </p>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 150,
      sticky: true,
      renderCell: ({ row }) => (
        <div className="flex justify-start items-center gap-1">
          <IconButton
            size="small"
            title="Xem chi tiết"
            sx={{
              backgroundColor: '#3b82f6',
              color: 'white',
              '&:hover': {
                backgroundColor: '#2563eb',
              },
            }}
            onClick={() => onViewDetails(row.original)}
          >
            <Eye size={18} />
          </IconButton>
          <IconButton
            size="small"
            title="Chỉnh sửa"
            sx={{
              backgroundColor: '#eab308',
              color: 'white',
              '&:hover': {
                backgroundColor: '#ca8a04',
              },
            }}
            onClick={() => onEdit(row.original)}
          >
            <Edit2 size={18} />
          </IconButton>
        </div>
      ),
    },
  ];

  if (staff.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="text-center">
          <span className="text-4xl block mb-4">👤</span>
          <p className="text-gray-500 font-medium">
            Không tìm thấy nhân viên nào
          </p>
        </div>
      </div>
    );
  }

  return (
    <CommonTable
      ordinalColumn
      rows={tableRows}
      columns={columns}
      totalItems={totalItems || staff.length}
      currentPage={page}
      onPageChange={onPageChange ?? (() => {})}
      rowsPerPage={limit}
      onRowsPerPageChange={onLimitChange}
      stickyHeader
      maxHeight="calc(100vh - 100px)"
      onRowDoubleClick={(row) => {
        onViewDetails(row.original);
      }}
    />
  );
}
