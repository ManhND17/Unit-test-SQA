import ApiArticle from '@api/ApiArticle';
import QUERY_KEY from '@api/QueryKey';
import { ArticleCard } from '@components/ArticleCard';
import CommonInput from '@components/CommonInput';
import { SkeletonArticleCard } from '@components/SkeletonArticleCard';
import { Grid, Pagination, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SearchArticle() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    decodeURIComponent(searchParams.get('q') || '')
  );
  const [query, setQuery] = useState(
    decodeURIComponent(searchParams.get('q') || '')
  );
  const navigate = useNavigate();
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setPage(1);
      setQuery(searchValue);
      setSearchParams((prev) => {
        prev.set('q', encodeURIComponent(searchValue));
        prev.set('page', '1');
        return prev;
      });
    }
  };

  const {
    data: articles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEY.ARTICLE.SEARCH_ARTICLES, query, page],
    queryFn: () =>
      ApiArticle.searchArticles({
        search: query,
        page: page,
        limit: 12,
        sortBy: 'title',
        sortOrder: 'asc',
      }),
  });

  return (
    <div className="container mx-auto px-2 pt-8 lg:pt-12 space-y-4">
      <div>
        <CommonInput
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="!rounded-full md:!w-[500px]"
          icon={SearchIcon}
          placeholder="Tìm kiếm bài viết"
        />
      </div>
      <div>
        {isLoading ? (
          <Skeleton variant="text" width={220} height={32} sx={{ mb: 3 }} />
        ) : (
          <h2 className="text-xl lg:text-[28px] font-bold mb-6">
            Kết quả tìm kiếm:{' '}
            <span className="text-red-500">{decodeURIComponent(query)}</span> (
            {articles?.metadata?.totalItems || ' '} kết quả)
          </h2>
        )}

        <Grid container spacing={3}>
          {isLoading ? (
            Array.from({ length: 12 }).map((_, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                <SkeletonArticleCard />
              </Grid>
            ))
          ) : isError ? (
            <p>Đã xảy ra lỗi khi tìm kiếm bài viết</p>
          ) : articles?.data.length === 0 ? (
            <p>Không tìm thấy bài viết</p>
          ) : (
            articles?.data.map((article) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={article.id}>
                <ArticleCard
                  image={article.imageUrl}
                  category={article.category.name}
                  title={article.title}
                  description={article.summary || ''}
                  date={article.createdAt}
                  onClick={() => navigate(`/articles/${article.slug}`)}
                />
              </Grid>
            ))
          )}
        </Grid>
        <div className="mt-6">
          {isLoading ? (
            <div className="flex gap-2 justify-center">
              <Skeleton variant="rectangular" width={32} height={32} />
              <Skeleton variant="rectangular" width={32} height={32} />
              <Skeleton variant="rectangular" width={32} height={32} />
              <Skeleton variant="rectangular" width={32} height={32} />
              <Skeleton variant="rectangular" width={32} height={32} />
            </div>
          ) : (
            <div className="flex gap-2 justify-center">
              <Pagination
                variant="outlined"
                shape="rounded"
                count={articles?.metadata?.totalPages}
                page={page}
                sx={{
                  '& .Mui-selected': {
                    backgroundColor: '#2563eb !important',
                    color: 'white',
                  },
                }}
                onChange={(_, value) => {
                  setPage(value);
                  setSearchParams((prev) => {
                    prev.set('page', value.toString());
                    return prev;
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
