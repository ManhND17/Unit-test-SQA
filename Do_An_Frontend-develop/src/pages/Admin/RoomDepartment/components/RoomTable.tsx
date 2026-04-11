import Badge from '../../../../components/CommonBadge';
import { Eye, Pencil, Trash } from 'lucide-react';
import { ERoomStatus, ERoomType, IRoom, RoomStatusLabels } from '@src/types';
import CommonTable, { CommonTableColumn } from '@src/components/CommonTable';
import { IconButton } from '@mui/material';

interface RoomTableProps {
  rooms: IRoom[];
  onView: (room: IRoom) => void;
  onEdit: (room: IRoom) => void;
  onDelete: (room: IRoom) => void;
  // pagination props
  page?: number;
  limit?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (p: number) => void;
  onLimitChange?: (n: number) => void;
}

const statusVariants = {
  not_used: 'success' as const,
  used: 'warning' as const,
  maintenance: 'error' as const,
};

interface IRoomRow {
  id: string;
  number_room: number;
  name: string;
  floor: number;
  type: ERoomType;
  status: ERoomStatus;
  original: IRoom;
}

export function RoomTable({
  rooms,
  onView,
  onEdit,
  onDelete,
  page = 1,
  limit = 10,
  totalItems,
  onLimitChange,
  onPageChange,
}: RoomTableProps) {
  const tableRows: (IRoomRow & { original: IRoom })[] =
    rooms.map((item: IRoom) => ({
      id: item?.id,
      name: item?.name,
      number_room: item?.number_room,
      floor: item?.floor,
      type: item?.type,
      status: item?.status,
      original: item,
    })) || [];

  const columns: CommonTableColumn<IRoomRow>[] = [
    {
      field: 'number_room',
      headerName: 'Số phòng',
      width: 90,
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
      headerName: 'Tên phòng',
      width: 250,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value}
          </p>
        </div>
      ),
    },
    {
      field: 'floor',
      headerName: 'Tầng',
      width: 50,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value || '-'}
          </p>
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 200,
      renderCell: ({ value }: { value: ERoomStatus }) => (
        <div className="w-full h-full flex items-center">
          <Badge variant={statusVariants[value]}>
            {RoomStatusLabels[value]}
          </Badge>
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
      totalItems={totalItems ?? rooms.length}
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
