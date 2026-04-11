import { Box, CircularProgress } from '@mui/material';
import ApiArticle from '@src/api/ApiArticle';
import QUERY_KEY from '@src/api/QueryKey';
import CommonModal from '@src/components/Modal';
import { useQuery } from '@tanstack/react-query';

interface IModalPreviewArticleProps {
  open: boolean;
  close: () => void;
  articleId?: string;
}
export default function ModalPreviewArticle({
  open,
  close,
  articleId,
}: IModalPreviewArticleProps) {
  const getDetailArticle = useQuery({
    queryKey: [QUERY_KEY.ARTICLE.GET_ARTICLE_BY_ID, articleId],
    enabled: !!articleId,
    queryFn: () => ApiArticle.getArticleById(articleId!),
  });
  return (
    <div>
      <CommonModal
        title={`Chi tiết bài viết: ${getDetailArticle.data?.title || ''}`}
        open={open}
        onClose={close}
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
    </div>
  );
}
