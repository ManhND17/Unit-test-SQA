import QUERY_KEY from '@api/QueryKey';
import CommonTable, { CommonTableColumn } from '@components/CommonTable';
import { IconButton } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Eye, Pencil, RefreshCcw, X } from 'lucide-react';
import { useState } from 'react';
import { EAppointmentStatus } from 'src/types';
import CommonInput from '@src/components/CommonInput';
import useDebounce from '@src/hooks/useDebounce';
import CommonSelect from '@src/components/CommonSelect';
import ApiAppointment, {
  type AppointmentResponseDto,
} from '@src/api/ApiAppointment';
import {
  endOfDayISO,
  formatDateTimeFromIso,
  startOfDayISO,
} from '@src/utils/datetime';
import Badge from '@src/components/CommonBadge';
import UpcomingAppointmentsList from '@src/components/UpcomingAppointmentsList';
import ModalDetailAppointment from '@pages/Admin/Appointment/components/ModalDetailAppointment';
import DatePickerComponent from '@src/components/DatePicker';
import { useSelector } from 'react-redux';
import { IRootState } from '@src/redux/store';
import { mapAppointmentStatus, mapAppointmentType } from '@src/utils/mapStatus';
import ModalCancelAppointment from './components/ModalCancelAppointment';
import ModalEditAppointment from './components/ModalEditAppointment';

export default function PatientManageAppointment() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusAppointment, setStatusAppointment] = useState<
    EAppointmentStatus | 'all'
  >('all');
  const { id: patientId } = useSelector(
    (state: IRootState) => state.auth.user!
  );
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponseDto | null>(null);
  const searchDebounced = useDebounce(search, 500);

  const [sortModel, setSortModel] = useState<{
    field: string;
    sort: 'asc' | 'desc';
  } | null>(null);

  const getAppointments = useQuery({
    queryKey: [
      QUERY_KEY.APPOINTMENT.GET_APPOINTMNETS,
      page,
      limit,
      statusAppointment,
      searchDebounced,
      sortModel,
      date.toISOString(),
    ],
    placeholderData: keepPreviousData,
    queryFn: () => {
      const optionSearch: any = {};
      if (search) {
        optionSearch.search = search;
      }
      if (statusAppointment !== 'all') {
        optionSearch.status = statusAppointment;
      }
      if (date) {
        optionSearch.fromDate = startOfDayISO(date);
        optionSearch.toDate = endOfDayISO(date);
      }
      return ApiAppointment.getListAppointments({
        page,
        limit,
        patientId: patientId,
        ...optionSearch,
      });
    },
  });

  const tableRows: (AppointmentResponseDto & {
    original: AppointmentResponseDto;
  })[] =
    getAppointments?.data?.data?.map((item: AppointmentResponseDto) => ({
      id: item?.id,
      patient: item?.patient,
      reason: item?.reason,
      status: item?.status,
      notes: item?.notes,
      createdAt: item?.createdAt,
      updatedAt: item?.updatedAt,
      bookedBy: item?.bookedBy,
      medicalService: item?.medicalService,
      department: item?.department,
      doctor: item?.doctor,
      schedule: item?.schedule,
      startTime: item?.startTime,
      endTime: item?.endTime,
      type: item?.type,
      reasonCancel: item?.reasonCancel,
      original: item,
    })) || [];

  const columns: CommonTableColumn<AppointmentResponseDto>[] = [
    {
      field: 'doctor',
      headerName: 'Bác sĩ',
      width: 250,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <img
            src={value?.avatar || '/images/default-image.jpeg'}
            alt=""
            className="rounded-lg w-[40px] h-[40px] object-cover mr-3"
          />
          <div className="flex-1">
            <p className="line-clamp-2 truncate whitespace-break-spaces">
              {value.level ? `${value.level}. ` : ''}
              {value?.name || '-'}
            </p>
            <p className="text-gray-500">{value?.specialization || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      field: 'medicalService',
      headerName: 'Dịch vụ',
      width: 200,
      renderCell: ({ value, row }) => (
        <div className="w-full h-full">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value.name || '-'}
          </p>
          <p className="text-gray-500">{row?.department?.name || '-'}</p>
        </div>
      ),
    },
    {
      field: 'startTime',
      headerName: 'Thời gian',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {formatDateTimeFromIso(value) || '-'}
          </p>
        </div>
      ),
    },
    {
      field: 'endTime',
      headerName: 'Kết thúc',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {formatDateTimeFromIso(value) || '-'}
          </p>
        </div>
      ),
    },
    {
      field: 'bookedBy',
      headerName: 'Người đặt',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value?.name || '-'}
          </p>
        </div>
      ),
    },
    {
      field: 'type',
      headerName: 'Loại',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <Badge variant={mapAppointmentType(value).variant}>
            {mapAppointmentType(value).label}
          </Badge>
        </div>
      ),
    },
    {
      field: 'reason',
      headerName: 'Lý do',
      width: 200,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
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
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <Badge variant={mapAppointmentStatus(value).variant}>
            {mapAppointmentStatus(value).label}
          </Badge>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 150,
      sticky: true,
      renderCell: ({ row }) => (
        <div className="flex justify-start items-center gap-2 flex-wrap">
          <IconButton
            size="small"
            title="Xem chi tiết"
            sx={{
              backgroundColor: 'transparent',
            }}
            onClick={() => {
              setSelectedAppointment(row);
              setOpenDetailModal(true);
            }}
          >
            <Eye size={20} />
          </IconButton>
          {row.status === EAppointmentStatus.PENDING && (
            <>
              <IconButton
                size="small"
                title="Chỉnh sửa"
                sx={{
                  backgroundColor: 'transparent',
                }}
                onClick={() => {
                  setSelectedAppointment(row);
                  setOpenEditModal(true);
                }}
              >
                <Pencil size={20} />
              </IconButton>
            </>
          )}
          {[EAppointmentStatus.PENDING, EAppointmentStatus.CONFIRMED].includes(
            row.status as EAppointmentStatus
          ) && (
            <IconButton
              size="small"
              title="Hủy lịch hẹn"
              sx={{
                backgroundColor: 'transparent',
              }}
              onClick={() => {
                setSelectedAppointment(row);
                setOpenCancelModal(true);
              }}
            >
              <X color="red" size={20} />
            </IconButton>
          )}
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold mb-4">
            Danh sách lịch hẹn của bệnh nhân
          </h2>
        </div>
        <div className="flex gap-5 flex-wrap mb-4 justify-between">
          <div className="flex flex-col">
            <label className="block font-medium mb-2">Tìm kiếm</label>
            <CommonInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm theo tên bệnh nhân, ID ..."
              className="!w-full md:!w-[400px] h-[stretch]"
            />
          </div>
          <div className="flex items-stretch gap-6">
            <div className="flex flex-col gap-2">
              <label className="block font-medium">Trạng thái</label>
              <CommonSelect
                values={[
                  { name: 'Tất cả', id: 'all' },
                  { name: 'Chờ xác nhận', id: 'pending' },
                  { name: 'Đã xác nhận', id: 'confirmed' },
                  { name: 'Đã hủy', id: 'cancelled' },
                  { name: 'Đã hoàn thành', id: 'completed' },
                ]}
                value={statusAppointment}
                onChange={(selected) =>
                  setStatusAppointment(selected as EAppointmentStatus | 'all')
                }
                className="h-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block font-medium">Chọn ngày</label>

              <DatePickerComponent
                value={date.toISOString()}
                onChange={(selected) => {
                  if (selected) {
                    setDate(selected.toDate());
                  }
                }}
              />
            </div>
            <div className="flex items-end">
              <RefreshCcw
                size={18}
                onClick={() => {
                  getAppointments.refetch();
                }}
              />
            </div>
          </div>
        </div>
        <CommonTable
          ordinalColumn
          rows={tableRows}
          columns={columns}
          loading={getAppointments?.isLoading}
          totalItems={getAppointments?.data?.metadata?.totalItems}
          currentPage={page}
          onPageChange={setPage}
          rowsPerPage={limit}
          onRowsPerPageChange={setLimit}
          sortModel={sortModel}
          onSortChange={handleSortChange}
          stickyHeader
          maxHeight="calc(100vh - 250px)"
          onRowDoubleClick={(row) => {
            setSelectedAppointment(row.original);
            setOpenDetailModal(true);
          }}
        />

        {/* Upcoming appointments (next 7 days) */}
        <UpcomingAppointmentsList
          patientId={patientId}
          days={7}
          defaultLimit={5}
          onOpenDetail={(a) => {
            setSelectedAppointment(a);
            setOpenDetailModal(true);
          }}
          applyRole="patient"
        />
      </div>
      <ModalDetailAppointment
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        appointment={selectedAppointment}
      />
      <ModalCancelAppointment
        open={openCancelModal}
        close={() => setOpenCancelModal(false)}
        appointmentId={selectedAppointment?.id}
        onSuccess={() => {
          getAppointments.refetch();
        }}
      />
      <ModalEditAppointment
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        appointment={selectedAppointment}
        onSuccess={() => {
          getAppointments.refetch();
        }}
      />
    </>
  );
}
