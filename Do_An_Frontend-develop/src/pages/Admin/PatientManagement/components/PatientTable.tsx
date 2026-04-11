import { IUser } from '@src/types';
import { Eye, Edit2 } from 'lucide-react';
import CommonTable, { CommonTableColumn } from '@src/components/CommonTable';
import { IconButton } from '@mui/material';

interface PatientTableProps {
  patients: IUser[];
  onEdit: (patient: IUser) => void;
  onDelete?: (patient: IUser) => void;
  onViewDetails: (patient: IUser) => void;
  // pagination props
  page?: number;
  limit?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (p: number) => void;
  onLimitChange?: (n: number) => void;
}

interface IPatientRow {
  id: string;
  avatar: string;
  username: string;
  patientId: string;
  email: string;
  phone?: string | null;
  createdAt: string;
  original: IUser;
}

export function PatientTable({
  patients,
  onEdit,
  onViewDetails,
  page = 1,
  limit = 10,
  totalItems,
  onPageChange,
  onLimitChange,
}: PatientTableProps) {
  const tableRows: IPatientRow[] = patients.map((patient: IUser) => ({
    id: patient.id,
    avatar: patient.avatar,
    username: patient.username,
    patientId: patient.patient?.patientId || '-',
    email: patient.email,
    phone: patient.phone,
    createdAt: patient.createdAt,
    original: patient,
  }));

  const columns: CommonTableColumn<IPatientRow>[] = [
    {
      field: 'username',
      headerName: 'Bệnh nhân',
      width: 250,
      renderCell: ({ row }) => (
        <div className="w-full h-full flex items-center">
          <div className="flex items-center gap-3">
            <img
              src={row.avatar}
              alt={row.username}
              className="h-10 w-10 rounded-full object-cover"
            />
            <p className="font-medium text-gray-900">{`${row.original.name?.firstName} ${row.original.name?.lastName}`}</p>
          </div>
        </div>
      ),
    },
    {
      field: 'patientId',
      headerName: 'ID Bệnh nhân',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            {value}
          </span>
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
      field: 'createdAt',
      headerName: 'Ngày đăng ký',
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
              backgroundColor: '#10b981',
              color: 'white',
              '&:hover': {
                backgroundColor: '#059669',
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

  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="text-center">
          <span className="text-4xl block mb-4">🏥</span>
          <p className="text-gray-500 font-medium">
            Không tìm thấy bệnh nhân nào
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
      totalItems={totalItems || patients.length}
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
