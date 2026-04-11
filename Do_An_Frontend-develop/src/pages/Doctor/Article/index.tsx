import QUERY_KEY from '@api/QueryKey';
import CommonTable, { CommonTableColumn } from '@components/CommonTable';
import { Box, CircularProgress, IconButton } from '@mui/material';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { Eye, Pencil, Send, Trash } from 'lucide-react';
import { useState } from 'react';
import { EArticleStatus, ICategory, IHealthArticle } from 'src/types';
import CommonInput from '@src/components/CommonInput';
import useDebounce from '@src/hooks/useDebounce';
import CommonSelect from '@src/components/CommonSelect';
import ApiArticle from '@src/api/ApiArticle';
import ApiCategory from '@src/api/ApiCategory';
import CommonButton from '@src/components/CommonButton';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetArticle,
  setEditMode,
} from '@src/redux/slices/ArticleEditorSlice';
import { IRootState } from '@src/redux/store';
import CommonModal from '@src/components/Modal';
import { toast } from 'react-toastify';
import { mapArticleStatus } from '@src/utils/mapStatus';
import Badge from '@src/components/CommonBadge';

interface ArticleRow {
  id: string;
  title: string;
  content: string;
  summary?: string;
  slug: string;
  imageUrl?: string;
  viewCount: number;
  category: ICategory;
  publishedAt: string;
  status: EArticleStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  original: IHealthArticle;
}

export default function AdminManageArticles() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusArticle, setStatusArticle] = useState<EArticleStatus | 'all'>(
    'all'
  );
  const { user } = useSelector((state: IRootState) => state.auth);
  const [search, setSearch] = useState('');
  const [filteredCategory, setFilteredCategory] = useState<string>('all');

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openReasonRejectModal, setOpenReasonRejectModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<IHealthArticle | null>(
    null
  );

  const navigate = useNavigate();
  const searchDebounced = useDebounce(search, 500);

  const dispatch = useDispatch();

  const [sortModel, setSortModel] = useState<{
    field: string;
    sort: 'asc' | 'desc';
  } | null>(null);

  const getArticles = useQuery({
    queryKey: [
      QUERY_KEY.ARTICLE.SEARCH_ARTICLES,
      page,
      limit,
      statusArticle,
      searchDebounced,
      sortModel,
      filteredCategory,
    ],
    placeholderData: keepPreviousData,
    queryFn: () => {
      const optionSearch: any = {};
      if (search) {
        optionSearch.search = search;
      }
      if (statusArticle === 'reedited') {
        optionSearch.status = EArticleStatus.REEDITED;
        optionSearch.assigneeId = user?.id;
      } else if (statusArticle !== 'all') {
        optionSearch.status = statusArticle;
        optionSearch.authorId = user?.id;
      } else {
        optionSearch.authorId = user?.id;
      }
      if (filteredCategory !== 'all') {
        optionSearch.categoryId = filteredCategory;
      }
      return ApiArticle.getArticles({
        page,
        limit,
        ...optionSearch,
      });
    },
  });

  const deleteArticle = useMutation({
    mutationFn: (id: string) => ApiArticle.deleteArticle(id),
    onSuccess: () => {
      toast.success('Xóa bài viết thành công');
      getArticles.refetch();
      setOpenDeleteModal(false);
    },
    onError: () => {
      toast.error('Xóa bài viết thất bại. Vui lòng thử lại.');
    },
  });

  const sendApprovalArticle = useMutation({
    mutationFn: (id: string) => ApiArticle.sendArticleForReview(id),
    onSuccess: () => {
      toast.success('Gửi duyệt bài viết thành công');
      getArticles.refetch();
      setOpenDetailModal(false);
    },
    onError: () => {
      toast.error('Gửi duyệt bài viết thất bại. Vui lòng thử lại.');
    },
  });

  const getDetailArticle = useQuery({
    queryKey: [QUERY_KEY.ARTICLE.GET_ARTICLE_BY_ID, selectedArticle?.id],
    enabled: !!selectedArticle,
    queryFn: () => ApiArticle.getArticleById(selectedArticle!.id),
  });

  const getCategories = useQuery({
    queryKey: [QUERY_KEY.CATEGORY.GET_CATEGORIES],
    queryFn: () => ApiCategory.getCategories(),
  });

  const tableRows: (ArticleRow & { original: IHealthArticle })[] =
    getArticles?.data?.data?.map((item: IHealthArticle) => ({
      id: item?.id,
      title: item?.title,
      content: item?.content,
      summary: item?.summary,
      slug: item?.slug,
      imageUrl: item?.imageUrl || undefined,
      category: item?.category,
      viewCount: item?.viewCount,
      publishedAt: item?.publishedAt,
      status: item?.status,
      featured: item?.featured,
      createdAt: item?.createdAt,
      updatedAt: item?.updatedAt,
      original: item,
    })) || [];

  const columns: CommonTableColumn<ArticleRow>[] = [
    {
      field: 'imageUrl',
      headerName: 'Ảnh bìa',
      width: 136,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <img
            src={value || '/images/default-image.jpeg'}
            alt=""
            className="rounded-lg"
          />
        </div>
      ),
    },
    {
      field: 'title',
      headerName: 'Tiêu đề',
      width: 250,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p className="line-clamp-2 truncate whitespace-break-spaces">
            {value}
          </p>
        </div>
      ),
    },
    {
      field: 'category',
      headerName: 'Danh mục',
      width: 150,
      renderCell: ({ value }: { value: ICategory }) => (
        <div className="w-full h-full">
          <Badge variant="info">{value.name || '-'}</Badge>
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 200,
      renderCell: ({ value, row }) => (
        <div className="w-full h-full space-y-2">
          <Badge variant={mapArticleStatus(value).variant}>
            {mapArticleStatus(value).label}
          </Badge>
          {value === EArticleStatus.REJECTED && (
            <p
              className="text-red-500 underline italic hover:cursor-pointer"
              onClick={() => {
                setOpenReasonRejectModal(true);
                setSelectedArticle(row.original);
              }}
            >
              Xem lý do
            </p>
          )}
        </div>
      ),
    },
    {
      field: 'viewCount',
      headerName: 'Số lượt xem',
      width: 100,
      headerAlign: 'center',
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p className="text-center">{value}</p>
        </div>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      headerAlign: 'center',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p className="text-center">
            {new Date(value).toLocaleDateString('vi-VN')}
          </p>
        </div>
      ),
    },
    {
      field: 'updatedAt',
      headerName: 'Cập nhật',
      headerAlign: 'center',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p className="text-center">
            {new Date(value).toLocaleDateString('vi-VN')}
          </p>
        </div>
      ),
    },
    {
      field: 'publishedAt',
      headerName: 'Ngày xuất bản',
      headerAlign: 'center',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full">
          <p className="text-center">
            {new Date(value).toLocaleDateString('vi-VN')}
          </p>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 200,
      sticky: true,
      renderCell: ({ row }) => (
        <div className="flex justify-start items-center gap-2 flex-wrap">
          <IconButton
            size="small"
            title="Xem chi tiết"
            sx={{
              backgroundColor: '#22c55e',
            }}
            onClick={() => {
              setSelectedArticle(row.original);
              setOpenDetailModal(true);
            }}
          >
            <Eye size={20} />
          </IconButton>
          {row.status !== EArticleStatus.PUBLISHED && (
            <>
              <IconButton
                size="small"
                title="Chỉnh sửa"
                sx={{
                  backgroundColor: 'yellow',
                }}
                onClick={() => {
                  dispatch(setEditMode(true));
                  navigate(
                    `/doctor/articles/create-edit?id=${row.original.id}`
                  );
                }}
              >
                <Pencil size={20} />
              </IconButton>
              <IconButton
                size="small"
                title="Xóa"
                sx={{
                  backgroundColor: 'red',
                }}
                onClick={() => {
                  setSelectedArticle(row.original);
                  setOpenDeleteModal(true);
                }}
              >
                <Trash size={20} />
              </IconButton>
              {row.status === EArticleStatus.DRAFT && (
                <IconButton
                  size="small"
                  title="Gửi duyệt"
                  sx={{
                    backgroundColor: '#30a8de',
                  }}
                  onClick={() => {
                    sendApprovalArticle.mutate(row.original.id);
                  }}
                >
                  <Send size={20} />
                </IconButton>
              )}
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

  const handleCreateArticle = () => {
    dispatch(resetArticle({ author: user }));
    navigate('/doctor/articles/create-edit');
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold mb-4">Danh sách bài viết</h2>
          <CommonButton text="Thêm bài viết" onClick={handleCreateArticle} />
        </div>
        <div className="flex gap-5 flex-wrap mb-4">
          <div>
            <label className="block mb-2 font-medium">Tìm kiếm</label>
            <CommonInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, tóm tắt"
              className="!w-full md:!w-[300px]"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Trạng thái</label>
            <CommonSelect
              values={[
                { name: 'Tất cả', id: 'all' },
                { name: 'Biên soạn', id: 'draft' },
                { name: 'Đang chờ duyệt', id: 'pending_review' },
                { name: 'Đã được duyệt', id: 'published' },
                { name: 'Được yêu cầu chỉnh sửa', id: 'reedited' },
                { name: 'Bị từ chối', id: 'rejected' },
              ]}
              value={statusArticle}
              onChange={(selected) =>
                setStatusArticle(selected as EArticleStatus | 'all')
              }
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Danh mục</label>
            <CommonSelect
              values={[
                { name: 'Tất cả', id: 'all' },
                ...(getCategories?.data?.data?.map((item) => ({
                  name: item.name,
                  id: item.id,
                })) || []),
              ]}
              value={filteredCategory}
              onChange={(selected) => setFilteredCategory(selected)}
            />
          </div>
        </div>
        <CommonTable
          ordinalColumn
          rows={tableRows}
          columns={columns}
          loading={getArticles?.isLoading}
          totalItems={getArticles?.data?.metadata?.totalItems}
          currentPage={page}
          onPageChange={setPage}
          rowsPerPage={limit}
          onRowsPerPageChange={setLimit}
          sortModel={sortModel}
          onSortChange={handleSortChange}
          stickyHeader
          maxHeight="calc(100vh - 250px)"
          onRowDoubleClick={(row) => {
            setSelectedArticle(row.original);
            setOpenDetailModal(true);
          }}
        />
      </div>
      <CommonModal
        title={`Chi tiết bài viết: ${selectedArticle?.title || ''}`}
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
      >
        <div className="min-h-[30vh] max-h-[80vh] overflow-y-auto ">
          {getDetailArticle.isLoading ? (
            <div className="flex items-center justify-center">
              <CircularProgress />
            </div>
          ) : (
            <Box marginTop={5} marginBottom={5}>
              <section
                className="article-content"
                dangerouslySetInnerHTML={{
                  __html: getDetailArticle.data?.content || 'Không có nội dung',
                }}
              />
            </Box>
          )}
        </div>
      </CommonModal>
      <CommonModal
        title={`Xóa bài viết: ${selectedArticle?.title || ''}`}
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <>
          <div>Bạn có chắc chắn muốn xóa bài viết này không?</div>
          <div className="flex justify-end items-center gap-4 mt-6">
            <CommonButton
              text="Hủy"
              onClick={() => setOpenDeleteModal(false)}
            />
            <CommonButton
              text="Xóa"
              isLoading={deleteArticle.isPending}
              color="#ff0000"
              onClick={() => {
                if (selectedArticle) {
                  deleteArticle.mutate(selectedArticle.id);
                }
              }}
            />
          </div>
        </>
      </CommonModal>
      <CommonModal
        title="Lý do từ chối bài viết"
        open={openReasonRejectModal}
        onClose={() => setOpenReasonRejectModal(false)}
      >
        <p>{selectedArticle?.reasonReject}</p>
      </CommonModal>
    </>
  );
}
