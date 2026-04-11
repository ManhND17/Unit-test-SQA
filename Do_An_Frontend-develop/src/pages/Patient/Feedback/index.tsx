import ApiContact from '@api/ApiContact';
import QUERY_KEY from '@api/QueryKey';
import CommonTable, { CommonTableColumn } from '@components/CommonTable';
import { IconButton } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { IContact } from 'src/types';
import ModalContactDetail from '@src/pages/Admin/Contact/components/ModalContactDetail';

interface ContactRow {
  id: string;
  fullname: string;
  email: string;
  phoneNumber: string | undefined;
  title: string | undefined;
  message: string;
  reply: string | undefined;
  isRead: boolean | undefined;
  createdAt: string;
  updatedAt: string;
  content: string;
  original: IContact;
}

export default function PatientFeedback() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);

  const getContacts = useQuery({
    queryKey: [QUERY_KEY.CONTACT.GET_MY_CONTACTS, page, limit],
    placeholderData: keepPreviousData,
    queryFn: () =>
      ApiContact.getMyContacts({
        page,
        limit,
      }),
  });

  const tableRows: (ContactRow & { original: IContact })[] =
    getContacts?.data?.data?.map((item: IContact) => ({
      id: item?.id,
      fullname: item?.fullname,
      email: item?.email,
      phoneNumber: item?.phone,
      title: item?.subject,
      message: item?.content,
      reply: item?.reply,
      isRead: item?.isRead,
      createdAt: item?.createdAt,
      updatedAt: item?.updatedAt,
      original: item,
      content: item?.content,
    })) || [];

  const columns: CommonTableColumn<ContactRow>[] = [
    {
      field: 'fullname',
      headerName: 'Họ và tên',
      width: 136,
      headerAlign: 'center',
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p>{value}</p>
        </div>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 190,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p>{value}</p>
        </div>
      ),
    },
    {
      field: 'phoneNumber',
      headerName: 'Số điện thoại',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p>{value || '-'}</p>
        </div>
      ),
    },
    {
      field: 'title',
      headerName: 'Tiêu đề',
      width: 200,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-2">{value || '-'}</p>
        </div>
      ),
    },
    {
      field: 'message',
      headerName: 'Nội dung phản ánh',
      width: 250,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-3">{value}</p>
        </div>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Ngày gửi',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p>{new Date(value).toLocaleDateString('vi-VN')}</p>
        </div>
      ),
    },
    {
      field: 'reply',
      headerName: 'Hồi đáp',
      width: 250,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-3">{value || '-'}</p>
        </div>
      ),
    },
    {
      field: 'updatedAt',
      headerName: 'Cập nhật lần cuối',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p>{new Date(value).toLocaleDateString('vi-VN')}</p>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      sticky: true,
      renderCell: ({ row }) => (
        <div className="flex justify-center items-center gap-1">
          <IconButton
            size="small"
            title="Xem chi tiết"
            sx={{
              backgroundColor: 'green',
            }}
            onClick={() => {
              setSelectedContact(row.original);
              setOpenDetailModal(true);
            }}
          >
            <Eye size={20} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Danh sách phản hồi của bạn</h2>
        <CommonTable
          ordinalColumn
          rows={tableRows}
          columns={columns}
          loading={getContacts?.isLoading}
          totalItems={getContacts?.data?.metadata?.totalItems}
          currentPage={page}
          onPageChange={setPage}
          rowsPerPage={limit}
          onRowsPerPageChange={setLimit}
          stickyHeader
          maxHeight="calc(100vh - 250px)"
          onRowDoubleClick={(row) => {
            setSelectedContact(row.original);
            setOpenDetailModal(true);
          }}
        />
      </div>
      {selectedContact && (
        <ModalContactDetail
          open={openDetailModal}
          onClose={() => setOpenDetailModal(false)}
          data={selectedContact}
        />
      )}
    </>
  );
}
