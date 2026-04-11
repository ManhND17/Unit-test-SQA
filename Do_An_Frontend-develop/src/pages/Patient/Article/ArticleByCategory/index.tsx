import ApiArticle from '@api/ApiArticle';
import ApiCategory from '@api/ApiCategory';
import QUERY_KEY from '@api/QueryKey';
import { ArticleCard } from '@components/ArticleCard';
import CommonAutoComplete, { IOption } from '@components/CommonAutoComplete';
import CommonInput from '@components/CommonInput';
import { SkeletonArticleCard } from '@components/SkeletonArticleCard';
import { Pagination, Skeleton, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ArticleByCategory() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const { slug } = useParams();
  const [page, setPage] = useState(1);

  const handleSelectCategory = (selectedCategory: IOption | null) => {
    if (!selectedCategory) {
      return;
    }
    navigate(`/articles/category/${selectedCategory.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const search = encodeURIComponent(searchValue);
      navigate(`/articles/search?q=${search}`);
    }
  };

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: [QUERY_KEY.CATEGORY.GET_CATEGORIES],
    queryFn: () => ApiCategory.getCategories(),
  });

  const selectedCategory = useMemo(() => {
    return categories?.data.find((item) => item.slug === slug);
  }, [slug, categories]);

  const {
    data: featuredArticles,
    isLoading: isLoadingFeaturedArticles,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEY.ARTICLE.GET_FEATURED_ARTICLES_BY_CATEGORY, slug],
    queryFn: () =>
      ApiArticle.getFeaturedArticles({
        page: 1,
        limit: 12,
        slug,
      }),
  });

  const { data: articles, isLoading: isLoadingArticles } = useQuery({
    queryKey: [QUERY_KEY.ARTICLE.GET_ARTICLES_BY_CATEGORY, slug, page],
    queryFn: () =>
      ApiArticle.getArticles({
        page: page,
        limit: 12,
        categoryId: selectedCategory?.id ? [selectedCategory.id] : undefined,
        sortBy: 'title',
      }),
    enabled: !!selectedCategory?.id,
  });

  useEffect(() => {
    if (isError) {
      toast.error('Đã xảy ra lỗi khi tìm kiếm bài viết');
    }
  }, [isError]);

  return (
    <div>
      <section className="relative min-h-[400px] flex items-center bg-gray-100 mx-auto">
        <div className="container px-3">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Chuyên mục{' '}
              <span className="lowercase first-letter:uppercase">
                {selectedCategory?.name}
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 line-clamp-3">
              {selectedCategory?.description}
            </p>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-2 pt-4 lg:pt-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <CommonAutoComplete
            options={
              categories?.data.map((item) => ({
                id: item.slug,
                name: item.name,
              })) || []
            }
            placeholder="Lựa chọn chuyên mục"
            onChange={handleSelectCategory}
            emptyMessage={
              isLoadingCategories ? 'Đang tải...' : 'Không có chuyên mục'
            }
            value={{
              id: slug || '',
              name: selectedCategory?.name || '',
            }}
            sx={{
              width: '300px',
            }}
          />
          <CommonInput
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            onKeyDown={handleKeyDown}
            className="md:!w-[300px]"
            icon={SearchIcon}
            placeholder="Tìm kiếm bài viết"
          />
        </div>
      </section>
      <section className="container mx-auto px-2 pt-8 lg:pt-12">
        <h2 className="text-[28px] font-bold mb-6">Bài viết nổi bật</h2>
        <div>
          <Grid container spacing={3}>
            {isLoadingFeaturedArticles ? (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <div>
                    <SkeletonArticleCard />
                  </div>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={2}>
                    <SkeletonArticleCard layoutRow={true} />
                    <SkeletonArticleCard layoutRow={true} />
                    <SkeletonArticleCard layoutRow={true} />
                    <SkeletonArticleCard layoutRow={true} />
                  </Stack>
                </Grid>
              </>
            ) : (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <div>
                    <ArticleCard
                      classNameThumbnail="!h-[500px]"
                      image={featuredArticles?.data[0].imageUrl || ''}
                      category={featuredArticles?.data[0].category.name || ''}
                      title={featuredArticles?.data[0].title || ''}
                      description={featuredArticles?.data[0].summary || ''}
                      date={featuredArticles?.data[0].publishedAt || ''}
                      onClick={() => {
                        if (featuredArticles?.data[0].slug) {
                          navigate(
                            `/articles/${featuredArticles?.data[0].slug}`
                          );
                        }
                      }}
                    />
                  </div>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={2}>
                    {featuredArticles?.data
                      .slice(1, 5)
                      .map((article, index) => (
                        <ArticleCard
                          layoutRow={true}
                          key={index}
                          image={article.imageUrl || ''}
                          category={article.category.name}
                          title={article.title}
                          description={article.summary || ''}
                          date={article.publishedAt}
                          onClick={() => {
                            if (article.slug) {
                              navigate(`/articles/${article.slug}`);
                            }
                          }}
                        />
                      ))}
                  </Stack>
                </Grid>
              </>
            )}
          </Grid>
        </div>
      </section>
      <section className="container mx-auto px-2 pt-8 lg:pt-12">
        <h2 className="text-[28px] font-bold mb-6">Tất cả bài viết</h2>

        <Grid container spacing={3}>
          {isLoadingArticles ? (
            Array.from({ length: 12 }).map((_, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                <SkeletonArticleCard />
              </Grid>
            ))
          ) : !articles?.data.length ? (
            <p>Không tìm thấy bài viết</p>
          ) : (
            articles?.data.map((article) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={article.id}>
                <ArticleCard
                  image={article.imageUrl || ''}
                  category={article.category.name}
                  title={article.title}
                  description={article.summary || ''}
                  date={article.publishedAt}
                  onClick={() => {
                    if (article.slug) {
                      navigate(`/articles/${article.slug}`);
                    }
                  }}
                />
              </Grid>
            ))
          )}
        </Grid>
        <div className="mt-6">
          {isLoadingArticles ? (
            <div className="flex gap-2 justify-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  variant="rectangular"
                  width={32}
                  height={32}
                  key={index}
                />
              ))}
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
                }}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
