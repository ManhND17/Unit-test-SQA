import CommonSelect from '@src/components/CommonSelect';
import CommonTable, { CommonTableColumn } from '@src/components/CommonTable';
import { IconButton } from '@mui/material';
import { ArrowDownToLine, Eye, Printer } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DatePickerComponent from '@src/components/DatePicker';
import { IVisit } from '@src/types';
import ApiVisit from '@src/api/ApiVisit';

interface VisitsRow {
  id: string;
  createdAt: string;
  departmentName: string;
  diagnosis: string;
  origin: IVisit;
}

interface IMedicalRecordsProps {
  patientId: string;
}

export default function MedicalRecords({ patientId }: IMedicalRecordsProps) {
  const [sort, setSort] = useState({
    sortBy: 'createdAt',
    sortOrder: 'asc',
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const navigate = useNavigate();
  const sortByOptions = [
    { name: 'Ngày khám (mới nhất)', id: 'createdAt-desc' },
    { name: 'Ngày khám (cũ nhất)', id: 'createdAt-asc' },
  ];

  const visitsByPatient = useQuery({
    queryKey: [
      'visitsByPatient',
      {
        page,
        limit,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
        fromDate: fromDate ? fromDate.toISOString() : undefined,
        toDate: toDate ? toDate.toISOString() : undefined,
        patientId,
      },
    ],
    queryFn: () =>
      ApiVisit.getVisitsOfPatient(patientId, {
        page,
        limit,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder as 'asc' | 'desc',
        fromDate: fromDate ? fromDate.toISOString() : undefined,
        toDate: toDate ? toDate.toISOString() : undefined,
      }),
    enabled: !!patientId,
  });

  const tableRows: VisitsRow[] =
    visitsByPatient?.data?.data?.map((record: IVisit) => ({
      id: record.id,
      createdAt: record.createdAt,
      departmentName:
        record?.doctor?.staff?.department?.name ||
        record?.doctor?.staff?.user?.name?.firstName +
          ' ' +
          record?.doctor?.staff?.user?.name?.lastName ||
        '-',
      diagnosis:
        record.medicalRecords?.find((mr) => mr.isParent)?.diagnosis || '-',
      origin: record,
    })) || [];

  const columns: CommonTableColumn<VisitsRow>[] = [
    {
      field: 'createdAt',
      headerName: 'Ngày khám',
      width: 150,
      renderCell: ({ value }) => (
        <p className="text-gray-900">
          {new Date(value).toLocaleDateString('vi-VN')}
        </p>
      ),
    },
    {
      field: 'departmentName',
      headerName: 'Khoa/Bác sĩ',
      width: 200,
      renderCell: ({ value }) => <p className="text-gray-900">{value}</p>,
    },
    {
      field: 'diagnosis',
      headerName: 'Chẩn đoán',
      width: 250,
      renderCell: ({ value }) => <p className="text-gray-900">{value}</p>,
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 200,
      renderCell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IconButton
            size="small"
            title="Xem chi tiết"
            sx={{
              backgroundColor: '#2563eb',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
            }}
            onClick={() => {
              navigate(`/patient/ehr/visits/${row.id}`);
            }}
          >
            <Eye size={16} />
          </IconButton>
          <IconButton
            size="small"
            title="In hồ sơ"
            sx={{
              backgroundColor: '#eab308',
              color: 'white',
              '&:hover': {
                backgroundColor: '#ca8a04',
              },
            }}
          >
            <Printer size={16} />
          </IconButton>
          <IconButton
            size="small"
            title="Tải xuống"
            sx={{
              backgroundColor: '#22c55e',
              color: 'white',
              '&:hover': {
                backgroundColor: '#16a34a',
              },
            }}
          >
            <ArrowDownToLine size={16} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Từ ngày
              </label>
              <DatePickerComponent
                value={fromDate ? fromDate.toISOString() : null}
                onChange={(selected) => {
                  if (selected) {
                    setFromDate(selected.toDate());
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Đến ngày
              </label>
              <DatePickerComponent
                value={toDate ? toDate.toISOString() : null}
                onChange={(selected) => {
                  if (selected) {
                    setToDate(selected.toDate());
                  }
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Bộ lọc</label>
            <CommonSelect
              values={sortByOptions}
              value={sort.sortBy + '-' + sort.sortOrder}
              onChange={(value) => {
                const [sortBy, sortOrder] = value.split('-');
                setSort({ sortBy, sortOrder });
              }}
            />
          </div>
        </div>
        <CommonTable
          ordinalColumn
          rows={tableRows}
          columns={columns}
          loading={visitsByPatient?.isLoading}
          totalItems={visitsByPatient?.data?.metadata?.totalItems}
          currentPage={page}
          onPageChange={setPage}
          rowsPerPage={limit}
          onRowsPerPageChange={setLimit}
          stickyHeader
          maxHeight="calc(100vh - 350px)"
        />
      </div>
    </>
  );
}
