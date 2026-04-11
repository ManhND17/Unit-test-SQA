import ApiContact from '@api/ApiContact';
import QUERY_KEY from '@api/QueryKey';
import CommonTable, { CommonTableColumn } from '@components/CommonTable';
import { IconButton } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Eye, Pencil } from 'lucide-react';
import { useState } from 'react';
import { IContact } from 'src/types';
import ModalReply from './components/ModalReply';
import ModalContactDetail from './components/ModalContactDetail';
import CommonInput from '@src/components/CommonInput';
import useDebounce from '@src/hooks/useDebounce';
import CommonSelect from '@src/components/CommonSelect';

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

export default function AdminContact() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isRead, setIsRead] = useState('all');
  const [search, setSearch] = useState('');
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);

  const searchDebounced = useDebounce(search, 500);

  const [sortModel, setSortModel] = useState<{
    field: string;
    sort: 'asc' | 'desc';
  } | null>(null);

  const getContacts = useQuery({
    queryKey: [
      QUERY_KEY.CONTACT.GET_CONTACTS,
      page,
      limit,
      isRead,
      searchDebounced,
      sortModel,
    ],
    placeholderData: keepPreviousData,
    queryFn: () =>
      ApiContact.adminGetContacts({
        page,
        limit,
        ...(isRead !== 'all' ? { isRead } : {}),
        ...(search ? { search } : {}),
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
      width: 200,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value}
          </p>
        </div>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
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
      field: 'phoneNumber',
      headerName: 'Số điện thoại',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value || '-'}
          </p>
        </div>
      ),
    },
    {
      field: 'title',
      headerName: 'Tiêu đề',
      width: 300,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value || '-'}
          </p>
        </div>
      ),
    },
    {
      field: 'message',
      headerName: 'Nội dung phản ánh',
      width: 400,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-3 truncate whitespace-break-spaces">
            {value}
          </p>
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
      width: 300,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value || '-'}
          </p>
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
        <div className="flex justify-start items-center gap-1">
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
          {!row.isRead && (
            <IconButton
              size="small"
              title="Trả lời"
              sx={{ backgroundColor: 'yellow' }}
            >
              <Pencil
                size={20}
                onClick={() => {
                  setSelectedContact(row);
                  setOpenReplyModal(true);
                }}
              />
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
        <h2 className="text-2xl font-bold mb-4">
          Danh sách phản hồi của khách hàng
        </h2>
        <div className="flex gap-5 flex-wrap mb-4">
          <CommonInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm kiếm theo tên, email"
          />
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
              { name: 'Đã đọc', id: 'true' },
              { name: 'Chưa đọc', id: 'false' },
            ]}
            value={isRead}
            onChange={(selected) => setIsRead(selected)}
          />
        </div>
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
          sortModel={sortModel}
          onSortChange={handleSortChange}
          stickyHeader
          maxHeight="calc(100vh - 250px)"
          onRowDoubleClick={(row) => {
            setSelectedContact(row.original);
            setOpenDetailModal(true);
          }}
        />
      </div>
      {selectedContact && (
        <ModalReply
          open={openReplyModal}
          onClose={() => setOpenReplyModal(false)}
          data={selectedContact}
          refetch={getContacts.refetch}
        />
      )}
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
