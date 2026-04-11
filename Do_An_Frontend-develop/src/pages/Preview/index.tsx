import TableOfContent from '@pages/Patient/Article/components/TableOfContent';
import { Typography, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Config from '@config';
import { IHealthArticle } from '@src/types';
import CommonButton from '@src/components/CommonButton';

interface IPreviewArticleProps {
  articleData?: Partial<IHealthArticle> | null;
}

export default function PreviewArticle({ articleData }: IPreviewArticleProps) {
  const articleString = localStorage.getItem('editorContent');

  if (articleData || !articleString) {
    <Box maxWidth="900px" mx="auto" px={{ xs: 1, sm: 2, md: 0 }} py={3}>
      <Typography variant="h6" color="red">
        Không tìm thấy dữ liệu bài viết để xem trước.
      </Typography>
    </Box>;
  }

  const article =
    articleData || (JSON.parse(articleString!) as Partial<IHealthArticle>);
  const toc = article?.toc;

  const navigate = useNavigate();

  const handleBackToEdit = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      if (window.opener && !window.opener.closed) {
        // Chuyển focus về tab cha
        window.opener.focus();
      }
      // Đóng tab hiện tại
      window.close();
    }
  };
  const publishedAt = article?.publishedAt
    ? dayjs(article.publishedAt).format('DD/MM/YYYY')
    : null;

  return (
    <Box maxWidth="900px" mx="auto" px={{ xs: 1, sm: 2, md: 0 }} py={3}>
      <Box mb={2}>
        <CommonButton text="Quay lại chỉnh sửa" onClick={handleBackToEdit} />
      </Box>

      <Typography variant="h4" fontWeight={700} color="#0f172a">
        {article?.title}
      </Typography>
      <div className="text-[#64748b] mt-2">Ngày đăng: {publishedAt}</div>
      <div className="flex items-end gap-2 text-[#64748b] mb-8">
        <p>Người viết: </p>
        <Avatar
          src={article?.author?.avatar || Config.DEFAULT_IMAGE.AVATAR}
          sx={{ width: 24, height: 24, ml: 0.5, mr: 0.5 }}
        />{' '}
        <span>
          {article?.author?.name?.firstName} {article?.author?.name?.lastName}
        </span>
      </div>
      <Box mb={3}>
        {toc ? (
          <TableOfContent
            toc={toc}
            onSectionClick={(id) => {
              const element = document.getElementById(id);
              if (element) {
                const navHeight = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition =
                  elementPosition + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth',
                });
              }
            }}
          />
        ) : null}
      </Box>
      <Box marginTop={5} marginBottom={5}>
        <section
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article?.content || '' }}
        />
      </Box>
    </Box>
  );
}
