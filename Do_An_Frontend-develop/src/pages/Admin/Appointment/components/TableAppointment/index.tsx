import QUERY_KEY from '@api/QueryKey';
import CommonTable, { CommonTableColumn } from '@components/CommonTable';
import { IconButton } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Check, Eye, X, Ticket, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { EAppointmentStatus } from 'src/types';
import CommonInput from '@src/components/CommonInput';
import useDebounce from '@src/hooks/useDebounce';
import CommonSelect from '@src/components/CommonSelect';
import CommonButton from '@src/components/CommonButton';
import CommonModal from '@src/components/Modal';
import { toast } from 'react-toastify';
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
import ModalRejectAppointment from '../ModalRejectAppointment';
import ModalDetailAppointment from '../ModalDetailAppointment';
import { mapAppointmentStatus, mapAppointmentType } from '@src/utils/mapStatus';
import DatePickerComponent from '@src/components/DatePicker';
import ModalAddEditVisit, {
  IVisitFormValues,
} from '@src/components/ModalAddEditVisit';
import ApiPatient from '@src/api/ApiPatient';

export default function TableAppointment() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusAppointment, setStatusAppointment] = useState<
    EAppointmentStatus | 'all'
  >('all');
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponseDto | null>(null);
  const [isCreateVisitModalOpen, setIsCreateVisitModalOpen] = useState(false);
  const [visitInitValues, setVisitInitValues] = useState<
    Partial<IVisitFormValues>
  >({});
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
      field: 'patient',
      headerName: 'Bệnh nhân',
      width: 250,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <img
            src={value?.avatar || '/images/default-image.jpeg'}
            alt=""
            className="rounded-lg w-[40px] h-[40px] object-cover mr-3"
          />
          <div className="flex-1">
            <p className="font-bold mb-2">{value?.name || '-'}</p>
            <p className="text-gray-500 font-semibold">
              ID: {value?.patientId ? `#${value.patientId}` : '-'}
            </p>
          </div>
        </div>
      ),
    },
    {
      field: 'doctor',
      headerName: 'Bác sĩ',
      width: 250,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value.level ? `${value.level}. ` : ''}
            {value?.name || '-'}
          </p>
          <p className="text-gray-500">{value?.specialization || '-'}</p>
        </div>
      ),
    },
    {
      field: 'medicalService',
      headerName: 'Dịch vụ',
      width: 150,
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
          {row.status === EAppointmentStatus.CONFIRMED && (
            <IconButton
              size="small"
              title="Tạo lượt khám"
              sx={{
                backgroundColor: 'transparent',
              }}
              onClick={async () => {
                try {
                  const patientDetail = await ApiPatient.getPatientInformation(
                    row.patient.id
                  );

                  const initValues: Partial<IVisitFormValues> = {
                    patient: patientDetail as any,
                    department: row.department as any,
                    medicalService: row.medicalService as any,
                    doctor: {
                      userId: row.doctor.id,
                      user: {
                        name: {
                          firstName: row.doctor.name.split(' ')[0] || '',
                          lastName:
                            row.doctor.name.split(' ').slice(1).join(' ') || '',
                        },
                      },
                    } as any,
                    startTime: row.startTime,
                    reason: row.reason,
                  };

                  setVisitInitValues(initValues);
                  setIsCreateVisitModalOpen(true);
                } catch {
                  toast.error('Không thể lấy thông tin bệnh nhân');
                }
              }}
            >
              <Ticket size={20} color="#4CBA87" />
            </IconButton>
          )}
          {row.status === EAppointmentStatus.PENDING && (
            <>
              <IconButton
                size="small"
                title="Duyệt lịch hẹn"
                sx={{
                  backgroundColor: 'transparent',
                }}
                onClick={() => {
                  setSelectedAppointment(row);
                  setOpenApproveModal(true);
                }}
              >
                <Check color="green" size={20} />
              </IconButton>
              <IconButton
                size="small"
                title="Từ chối lịch hẹn"
                sx={{
                  backgroundColor: 'transparent',
                }}
                onClick={() => {
                  setSelectedAppointment(row);
                  setOpenRejectModal(true);
                }}
              >
                <X color="red" size={20} />
              </IconButton>
            </>
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
          <h2 className="text-2xl font-bold mb-4">Danh sách lịch hẹn</h2>
        </div>
        <div className="flex gap-5 flex-wrap mb-4 justify-between">
          <div className="flex flex-col">
            <label className="block font-medium mb-2">Tìm kiếm</label>
            <CommonInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm theo tên bệnh nhân, tên bác sĩ..."
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
          days={7}
          defaultLimit={5}
          onOpenDetail={(a) => {
            setSelectedAppointment(a);
            setOpenDetailModal(true);
          }}
          applyRole="admin"
        />
      </div>
      <ModalDetailAppointment
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        appointment={selectedAppointment}
      />
      <CommonModal
        title={`Duyệt lịch hẹn - ${selectedAppointment?.patient.name}`}
        open={openApproveModal}
        onClose={() => setOpenApproveModal(false)}
      >
        <>
          <div>Bạn có chắc chắn muốn duyệt lịch hẹn này không?</div>
          <div className="flex justify-end items-center gap-4 mt-6">
            <CommonButton
              text="Hủy"
              onClick={() => setOpenApproveModal(false)}
            />
            <CommonButton
              text="Duyệt"
              color="green"
              onClick={() => {
                if (!selectedAppointment) return;
                ApiAppointment.approveAppointment(selectedAppointment.id)
                  .then(() => {
                    toast.success('Duyệt lịch hẹn thành công');
                    getAppointments.refetch();
                    setOpenApproveModal(false);
                  })
                  .catch(() => {
                    toast.error('Duyệt lịch hẹn thất bại. Vui lòng thử lại.');
                  });
              }}
            />
          </div>
        </>
      </CommonModal>
      <ModalRejectAppointment
        open={openRejectModal}
        close={() => setOpenRejectModal(false)}
        appointmentId={selectedAppointment?.id}
        onSuccess={() => {
          getAppointments.refetch();
        }}
      />
      <ModalAddEditVisit
        isOpen={isCreateVisitModalOpen}
        onClose={() => {
          setIsCreateVisitModalOpen(false);
          setVisitInitValues({});
        }}
        initValues={visitInitValues}
        onSubmit={() => {
          getAppointments.refetch();
        }}
      />
    </>
  );
}
