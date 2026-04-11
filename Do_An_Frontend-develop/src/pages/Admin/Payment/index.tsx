import QUERY_KEY from '@api/QueryKey';
import CommonTable, { CommonTableColumn } from '@components/CommonTable';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { CreditCard, Eye, RefreshCcw, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { EInvoiceStatus, EPaymentStatus, IInvoice } from 'src/types';
import useDebounce from '@src/hooks/useDebounce';
import CommonSelect from '@src/components/CommonSelect';
import CommonButton from '@src/components/CommonButton';
import { CommonDestopDatePicker } from '@src/components/DatePicker';
import { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import ApiInvoice, { InvoicePatient } from '@src/api/ApiInvoice';
import ApiPayment from '@src/api/ApiPayment';
import { toast } from 'react-toastify';
import Badge from '@src/components/CommonBadge';
import { mapInvoiceStatus, mapPaymentStatus } from '@src/utils/mapStatus';
import UnpaidService from './components/UnpaidService';
const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL as string;

interface InvoiceRow {
  id: string;
  fullname: string;
  birthday?: string | null;
  invoice?: IInvoice;
  total?: number;
  code?: string;
  status: EInvoiceStatus;
  amount: number;
  createdAt: string;
  payment: {
    id: string;
    amount: number;
    status: EPaymentStatus;
    createdAt: string;
  } | null;
}

export default function AdminPayment() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isPaid, setIsPaid] = useState('all');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState<string | null>(null);
  const navigate = useNavigate();
  const searchDebounced = useDebounce(search, 500);

  const [sortModel, setSortModel] = useState<{
    field: string;
    sort: 'asc' | 'desc';
  } | null>(null);

  const getInvoices = useQuery({
    queryKey: [
      QUERY_KEY.INVOICE.GET_LIST_INVOICE,
      page,
      limit,
      isPaid,
      searchDebounced,
      sortModel,
      fromDate,
    ],
    placeholderData: keepPreviousData,
    queryFn: () =>
      ApiInvoice.getListInvoices({
        page,
        limit,
        ...(isPaid !== 'all' ? { isPaid } : {}),
        ...(search ? { search } : {}),
        ...(fromDate ? { createdAt: fromDate } : {}),
      }),
  });

  const tableRows: (InvoiceRow & { original: InvoiceRow })[] =
    getInvoices.data?.data?.map((item: InvoicePatient) => {
      const values = {
        id: item.id,
        code: item.patient.patientId,
        fullname: item.patient.fullName,
        birthday: item.patient.birthday,
        status: item.status,
        amount: item.computedTotal.total,
        createdAt: item.createdAt,
        payment: item.payment || null,
      };
      return { ...values, original: values };
    }) || [];

  const columns: CommonTableColumn<InvoiceRow>[] = [
    {
      field: 'code',
      headerName: 'Mã BN',
      width: 136,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value}
          </p>
        </div>
      ),
    },
    {
      field: 'fullname',
      headerName: 'Họ và tên',
      width: 136,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value}
          </p>
        </div>
      ),
    },
    {
      field: 'birthday',
      headerName: 'Ngày sinh',
      width: 120,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p>{new Date(value).toLocaleDateString('vi-VN')}</p>
        </div>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      width: 150,
      renderCell: ({ value }: { value: string }) => (
        <div className="w-full h-full flex items-center">
          <p>{new Date(value).toLocaleDateString('vi-VN')}</p>
        </div>
      ),
    },
    {
      field: 'amount',
      headerName: 'Tổng tạm tính',
      width: 150,
      renderCell: ({ value }: { value: number }) => (
        <div className="w-full h-full flex items-center">
          <p>
            {value.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </p>
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'Trạng thái hóa đơn',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <Badge variant={mapInvoiceStatus(value).variant}>
            {mapInvoiceStatus(value).label}
          </Badge>
        </div>
      ),
    },
    {
      field: 'payment',
      headerName: 'Trạng thái thanh toán',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <Badge variant={mapPaymentStatus(value?.status).variant}>
            {mapPaymentStatus(value?.status).label}
          </Badge>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 200,
      sticky: true,
      renderCell: ({ row }) => (
        <div className="flex justify-start items-center gap-1">
          {row.status === 'pending' && row.payment === null ? (
            <CommonButton
              text="Thanh toán"
              startIcon={<CreditCard size={16} stroke="#fff" />}
              color="#1d4ed8"
              onClick={() => navigate(`/admin/invoices/${row.id}`)}
            />
          ) : row.payment?.status === 'failed' ? (
            <CommonButton
              text="Thanh toán lại"
              startIcon={<RotateCcw size={16} stroke="#fff" />}
              color="#ef4444"
              onClick={() => handleRetryPayment(row.id)}
            />
          ) : (
            <CommonButton
              text="Xem chi tiết"
              startIcon={<Eye size={16} stroke="#fff" />}
              color="#1d4ed8"
              onClick={() => {
                if (row.id) {
                  navigate(`/admin/invoices/${row.id}`);
                } else {
                  toast.error('Không tìm thấy thông tin thanh toán');
                }
              }}
            />
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

  const handleSelectDate = (selected: Dayjs | null) => {
    setFromDate(selected?.toISOString() || null);
  };

  const handleRetryPayment = async (invoiceId: string) => {
    try {
      const response = await ApiPayment.getLinkPaymentUrl(
        invoiceId,
        'vnpay',
        `${FRONTEND_BASE_URL}/payments/callback/status`
      );

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        toast.error('Không thể lấy đường dẫn thanh toán');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo đường dẫn thanh toán');
    }
  };

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Danh sách hóa đơn</h2>
        <div className="flex gap-5 flex-wrap mb-4 items-stretch w-full">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm theo mã BN, họ tên"
              className="w-full h-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <CommonSelect
            selectProps={{
              sx: {
                '& .MuiSelect-select': {
                  padding: '12px',
                },
              },
            }}
            values={[
              { name: 'Tất cả', id: 'all' },
              { name: 'Đang chờ', id: 'pending' },
              { name: 'Đã thanh toán', id: 'paid' },
              { name: 'Hủy', id: 'cancelled' },
            ]}
            value={isPaid}
            onChange={(selected) => setIsPaid(selected)}
          />
          <CommonDestopDatePicker
            value={fromDate}
            onChange={handleSelectDate}
          />
          <CommonButton
            onClick={() => {
              setFromDate(null);
              setIsPaid('all');
              setSearch('');
              getInvoices.refetch();
            }}
            text="Làm mới"
            startIcon={<RefreshCcw size={16} stroke="#fff" />}
            color="#1d4ed8"
            className="!h-[inherit]"
          />
        </div>
        <CommonTable
          ordinalColumn
          rows={tableRows}
          columns={columns}
          loading={getInvoices?.isLoading}
          totalItems={getInvoices?.data?.metadata?.totalItems}
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
      <UnpaidService />
    </>
  );
}
