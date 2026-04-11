import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import TableOfContent from '../components/TableOfContent';
import { Breadcrumbs, Typography, Box, Skeleton, Avatar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@api/QueryKey';
import ApiArticle from '@api/ApiArticle';
import dayjs from 'dayjs';
import { ArticleCard } from '@components/ArticleCard';
import Slider from '@components/Slider';
import { SkeletonArticleCard } from '@components/SkeletonArticleCard';
import Config from '@config';

export default function DetailArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: article, isLoading: isLoadingArticle } = useQuery({
    queryKey: [QUERY_KEY.ARTICLE.GET_ARTICLE_BY_SLUG, slug],
    queryFn: () => ApiArticle.getArticleBySlug(slug || ''),
    enabled: !!slug,
  });

  const { data: relatedArticles } = useQuery({
    queryKey: [QUERY_KEY.ARTICLE.GET_RELATED_ARTICLES, slug],
    queryFn: () =>
      ApiArticle.getRelatedArticles({
        page: 1,
        limit: 10,
        articleId: article?.id as string,
      }),
    enabled: !!article?.id,
  });

  const toc = article?.toc;
  const publishedAt = article?.publishedAt
    ? dayjs(article.publishedAt).format('DD/MM/YYYY')
    : null;

  return (
    <Box maxWidth="900px" mx="auto" px={{ xs: 1, sm: 2, md: 0 }} py={3}>
      <Box mb={2}>
        {isLoadingArticle ? (
          <Skeleton variant="text" width={220} height={32} />
        ) : (
          <Breadcrumbs aria-label="breadcrumb">
            <RouterLink
              to="/"
              style={{ textDecoration: 'none', color: '#64748b' }}
            >
              Trang chủ
            </RouterLink>
            <RouterLink
              to="/articles"
              style={{ textDecoration: 'none', color: '#64748b' }}
            >
              Bài viết
            </RouterLink>
            <Typography color="text.primary" fontWeight={600} fontSize={15}>
              {article?.title}
            </Typography>
          </Breadcrumbs>
        )}
      </Box>
      {isLoadingArticle ? (
        <Skeleton variant="text" width={400} height={38} />
      ) : (
        <Typography variant="h4" fontWeight={700} color="#0f172a">
          {article?.title}
        </Typography>
      )}
      {isLoadingArticle ? (
        <Skeleton variant="text" width={120} height={24} />
      ) : (
        <div className="text-[#64748b] mt-2">Ngày đăng: {publishedAt}</div>
      )}
      {isLoadingArticle ? (
        <Skeleton variant="text" width={120} height={24} />
      ) : (
        <div className="flex items-end gap-2 text-[#64748b] mb-8">
          <p>Người viết: </p>
          <Avatar
            src={article?.author.avatar || Config.DEFAULT_IMAGE.AVATAR}
            sx={{ width: 24, height: 24, ml: 0.5, mr: 0.5 }}
          />{' '}
          <span>
            {article?.author.name?.firstName} {article?.author.name?.lastName}
          </span>
        </div>
      )}
      <Box mb={3}>
        {isLoadingArticle ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={80}
            sx={{ borderRadius: 2 }}
          />
        ) : toc ? (
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
        {isLoadingArticle ? (
          <Box>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={320}
              sx={{ borderRadius: 2, mb: 2 }}
            />
            <Skeleton variant="text" width="80%" height={32} />
            <Skeleton variant="text" width="90%" height={32} />
            <Skeleton variant="text" width="70%" height={32} />
            <Skeleton variant="text" width="60%" height={32} />
          </Box>
        ) : (
          <section
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article?.content || '' }}
          />
        )}
      </Box>
      <Box>
        {!relatedArticles ? (
          <>
            <Skeleton variant="text" width={120} height={32} />
            <Slider slidesPerView={3}>
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonArticleCard key={index} />
              ))}
            </Slider>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-black mb-4 pb-2 border-b border-gray-200">
              Bài viết liên quan
            </div>
            <Box>
              {relatedArticles.length === 0 ? (
                <p className="text-xl">Không tìm thấy bài viết liên quan</p>
              ) : (
                <Slider slidesPerView={3}>
                  {relatedArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      image={article.imageUrl}
                      category={article.category.name}
                      title={article.title}
                      description={article.summary || ''}
                      date={article.publishedAt}
                      onClick={() => navigate(`/articles/${article.slug}`)}
                    />
                  ))}
                </Slider>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
