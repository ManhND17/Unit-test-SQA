import ApiArticle from '@api/ApiArticle';
import ApiCategory from '@api/ApiCategory';
import QUERY_KEY from '@api/QueryKey';
import { ArticleCard } from '@components/ArticleCard';
import CommonInput from '@components/CommonInput';
import CommonSelect from '@components/CommonSelect';
import { SkeletonArticleCard } from '@components/SkeletonArticleCard';
import Slider from '@components/Slider';
import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ArticleHome() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: [QUERY_KEY.CATEGORY.GET_CATEGORIES],
    queryFn: () => ApiCategory.getCategories(),
  });

  const { data: featuredArticles, isLoading: isLoadingFeaturedArticles } =
    useQuery({
      queryKey: [QUERY_KEY.ARTICLE.GET_FEATURED_ARTICLES],
      queryFn: () => ApiArticle.getFeaturedArticles({}),
    });

  const numberOfFeaturedArticles = featuredArticles?.data.length || 0;

  const handleSelectCategory = (selectedCategory: string) => {
    navigate(`/articles/category/${selectedCategory}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const search = encodeURIComponent(searchValue);
      navigate(`/articles/search?q=${search}`);
    }
  };

  return (
    <div>
      <section className="relative min-h-[400px] flex items-center bg-gray-100">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Chuyên mục sức khỏe
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Chia sẻ kiến thức, kinh nghiệm và thông tin hữu ích về sức khỏe
            </p>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-2 pt-4 lg:pt-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <CommonSelect
            values={
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
            className="md:!w-[300px]"
          />
          <CommonInput
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            onKeyDown={handleKeyDown}
            className=" md:!w-[300px]"
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
                    <SkeletonArticleCard classNameThumbnail="!h-[500px]" />
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
              numberOfFeaturedArticles > 0 && (
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
                            className="!flex-row"
                            key={index}
                            image={article.imageUrl}
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
              )
            )}
          </Grid>
        </div>
      </section>
      <section className="container mx-auto px-2 pt-8 lg:pt-12">
        <h2 className="text-[28px] font-bold mb-6">Bài viết xem nhiều nhất</h2>
        <div>
          <Grid container spacing={3}>
            {isLoadingFeaturedArticles ? (
              <>
                {Array.from({ length: 9 }).map((_, index) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                    <SkeletonArticleCard className="!flex-col" />
                  </Grid>
                ))}
              </>
            ) : (
              <>
                {featuredArticles?.data.slice(0, 9).map((article, index) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                    <ArticleCard
                      key={index}
                      image={article.imageUrl}
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
                ))}
              </>
            )}
          </Grid>
        </div>
      </section>
      <section className="container mx-auto px-2 pt-8 lg:pt-12">
        <h2 className="text-[28px] font-bold mb-6">Bài viết mới nhất</h2>
        <Grid container spacing={3}>
          {isLoadingFeaturedArticles ? (
            <>
              <Slider slidesPerView={3}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonArticleCard key={index} />
                ))}
              </Slider>
            </>
          ) : (
            <>
              <Slider slidesPerView={3}>
                {featuredArticles?.data.slice(0, 6).map((article, index) => (
                  <ArticleCard
                    key={index}
                    image={article.imageUrl}
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
              </Slider>
            </>
          )}
        </Grid>
      </section>
    </div>
  );
}
