import useDebounce from '@src/hooks/useDebounce';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';
import ApiPatient from '@src/api/ApiPatient';
import { IPatient } from '@src/types';
import CommonTable, { CommonTableColumn } from '@src/components/CommonTable';
import { IconButton } from '@mui/material';
import { Ticket } from 'lucide-react';
import CommonInput from '@src/components/CommonInput';
import ModalAddEditVisit from '@src/components/ModalAddEditVisit';

interface PatientRow {
  id: string;
  name: string;
  dob: string;
  phone: string;
  address: string;
  original: IPatient;
}

export default function PatientSearch() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [isCreateVisitModalOpen, setIsCreateVisitModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);

  const searchDebounced = useDebounce(search, 500);

  const [sortModel, setSortModel] = useState<{
    field: string;
    sort: 'asc' | 'desc';
  } | null>(null);

  const getPatients = useQuery({
    queryKey: [
      QUERY_KEY.PATIENT.GET_PATIENTS,
      page,
      limit,
      searchDebounced,
      sortModel,
    ],
    queryFn: () => {
      const optionSearch: any = {};
      if (search) {
        optionSearch.search = search;
      }
      return ApiPatient.getPatients({
        page,
        limit,
        ...optionSearch,
      });
    },
  });

  const tableRows: (PatientRow & { original: IPatient })[] =
    getPatients?.data?.data?.map((item: IPatient) => ({
      id: item?.patientId,
      name:
        [item?.user?.name?.firstName, item?.user?.name?.lastName]
          .filter(Boolean)
          .join(' ') || 'N/A',
      dob: item?.user?.birthday || 'N/A',
      phone: item?.user?.phone || 'N/A',
      address: (() => {
        const a = item?.user?.address;
        if (!a) return 'N/A';
        const parts = [a.detail, a.ward, a.district, a.city, a.country].filter(
          Boolean
        );
        return parts.join(', ') || 'N/A';
      })(),
      original: item,
    })) || [];

  const columns: CommonTableColumn<PatientRow>[] = [
    {
      field: 'id',
      headerName: 'Mã BN',
      width: 136,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p>{value}</p>
        </div>
      ),
    },
    {
      field: 'name',
      headerName: 'Họ và tên',
      width: 200,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value}
          </p>
        </div>
      ),
    },
    {
      field: 'dob',
      headerName: 'Ngày sinh',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p className="rounded-lg p-2 text-center w-max">
            {new Date(value).toLocaleDateString('vi-VN')}
          </p>
        </div>
      ),
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p className="rounded-lg p-2 text-center w-max">{value}</p>
        </div>
      ),
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
      width: 200,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p className="rounded-lg p-2 text-center truncate">{value}</p>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 100,
      sticky: true,
      renderCell: ({ row }) => (
        <div className="flex justify-start items-center gap-2 flex-wrap">
          <IconButton
            size="small"
            title="Tạo lượt khám"
            sx={{
              backgroundColor: 'transparent',
            }}
            onClick={() => {
              setIsCreateVisitModalOpen(true);
              setSelectedPatient(row.original);
            }}
          >
            <Ticket size={20} color="#4CBA87" />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleSortChange = (field: string, sort: 'asc' | 'desc' | null) => {
    if (sort === null) {
      setSortModel(null);
    } else {
      setSortModel({ field, sort });
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex gap-5 flex-wrap mb-4">
          <div>
            <label className="block mb-2 font-medium">Tìm kiếm</label>
            <CommonInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm theo tên, mã BN..."
              className="!w-full md:!w-[300px]"
            />
          </div>
        </div>
        <CommonTable
          ordinalColumn
          rows={tableRows}
          columns={columns}
          loading={getPatients?.isLoading}
          totalItems={getPatients?.data?.metadata?.totalItems}
          currentPage={page}
          onPageChange={setPage}
          rowsPerPage={limit}
          onRowsPerPageChange={setLimit}
          sortModel={sortModel}
          onSortChange={handleSortChange}
          stickyHeader
          maxHeight="calc(100vh - 250px)"
        />
      </div>
      <ModalAddEditVisit
        isOpen={isCreateVisitModalOpen}
        onClose={() => {
          setIsCreateVisitModalOpen(false);
        }}
        initValues={{
          patient: selectedPatient,
        }}
      />
    </>
  );
}
