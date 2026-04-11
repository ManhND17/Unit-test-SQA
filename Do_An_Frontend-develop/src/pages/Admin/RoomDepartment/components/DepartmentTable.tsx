import { Building2, Eye, Pencil, Trash, User, Users } from 'lucide-react';
import {
  IDepartment,
  DepartmentTypeLabels,
  EDepartmentType,
  IStaff,
} from '@src/types';
import CommonTable, { CommonTableColumn } from '@src/components/CommonTable';
import { IconButton } from '@mui/material';

interface DepartmentTableProps {
  departments: IDepartment[];
  onView: (department: IDepartment) => void;
  onEdit: (department: IDepartment) => void;
  onDelete: (department: IDepartment) => void;
  // pagination props
  page?: number;
  limit?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (p: number) => void;
  onLimitChange?: (n: number) => void;
}

const typeColors: Record<string, string> = {
  clinical: 'bg-blue-100 text-blue-700',
  paraclinical: 'bg-purple-100 text-purple-700',
  administrative: 'bg-gray-100 text-gray-700',
};

interface IDepartmentRow {
  id: number;
  code: string;
  name?: string;
  type?: EDepartmentType;
  head?: IStaff;
  deputies: number;
  room: string;
  original: IDepartment;
}

export function DepartmentTable({
  departments,
  onView,
  onEdit,
  onDelete,
  page = 1,
  limit = 10,
  totalItems,
  onLimitChange,
  onPageChange,
}: DepartmentTableProps) {
  const tableRows: (IDepartmentRow & { original: IDepartment })[] =
    departments.map((item: IDepartment) => ({
      id: item?.id,
      code: item?.code,
      name: item?.name,
      type: item?.type,
      head: item?.head,
      deputies: item?.deputies?.length ?? 0,
      room: item?.room?.name ?? '',
      original: item,
    })) || [];

  const columns: CommonTableColumn<IDepartmentRow>[] = [
    {
      field: 'code',
      headerName: 'Mã khoa',
      width: 120,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value}
          </p>
        </div>
      ),
    },
    {
      field: 'name',
      headerName: 'Tên khoa',
      width: 300,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value}
          </p>
        </div>
      ),
    },
    {
      field: 'type',
      headerName: 'Loại',
      width: 150,
      renderCell: ({ value }: { value: EDepartmentType }) => (
        <div className="w-full h-full flex items-center">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[value]}`}
          >
            {DepartmentTypeLabels[value]}
          </span>
        </div>
      ),
    },
    {
      field: 'head',
      headerName: 'Trưởng khoa',
      width: 200,
      renderCell: ({ value }: { value: IStaff }) => (
        <div className="w-full h-full flex items-center">
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            <span className="text-gray-700 truncate">
              {value &&
              (value.user?.name?.firstName || value.user?.name?.lastName)
                ? `${value.user?.name?.firstName ?? ''} ${value.user?.name?.lastName ?? ''}`.trim()
                : 'Chưa có'}
            </span>
          </div>
        </div>
      ),
    },
    {
      field: 'deputies',
      headerName: 'Phó khoa',
      width: 120,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <Users size={16} className="text-gray-400 mr-3" />
          <span className="text-gray-700">{value} người</span>
        </div>
      ),
    },
    {
      field: 'room',
      headerName: 'Phòng',
      width: 200,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          {value ? (
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-gray-400" />
              <span className="text-gray-700">{value}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">-----</span>
          )}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 120,
      sticky: true,
      renderCell: ({ row }) => (
        <div className="flex justify-start items-center gap-1">
          <IconButton
            size="small"
            title="Xem chi tiết"
            sx={{
              backgroundColor: 'green',
            }}
            onClick={() => onView(row.original)}
          >
            <Eye size={20} />
          </IconButton>
          <IconButton
            size="small"
            title="Sửa"
            sx={{
              backgroundColor: 'yellow',
            }}
            onClick={() => onEdit(row.original)}
          >
            <Pencil size={20} />
          </IconButton>
          <IconButton
            size="small"
            title="Xóa"
            sx={{
              backgroundColor: 'red',
            }}
            onClick={() => onDelete(row.original)}
          >
            <Trash size={20} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <CommonTable
      ordinalColumn
      rows={tableRows}
      columns={columns}
      totalItems={totalItems ?? departments.length}
      currentPage={page}
      onPageChange={onPageChange ?? (() => {})}
      rowsPerPage={limit}
      onRowsPerPageChange={onLimitChange}
      stickyHeader
      maxHeight="calc(100vh - 100px)"
      onRowDoubleClick={(row) => {
        onView(row.original);
      }}
    />
  );
}

export default DepartmentTable;
