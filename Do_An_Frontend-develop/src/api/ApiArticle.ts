import { IHealthArticle } from 'src/types';
import { fetcher, fetcherWithMetadata, QueryParam } from './Fetcher';

const path = {
  getFeaturedArticles: '/articles/featured',
  getArticleBySlug: '/articles/slug',
  getArticles: '/articles',
};

interface IParamsGetArticles extends QueryParam {
  categoryId?: string[];
  slug?: string;
  status?: string;
  authorId?: string;
  assigneeId?: string;
}

const getArticleBySlug = async (slug: string) => {
  return fetcher<IHealthArticle>({
    url: `${path.getArticleBySlug}/${slug}`,
    method: 'GET',
  });
};

const getArticleById = async (slug: string) => {
  return fetcher<IHealthArticle>({
    url: `${path.getArticles}/${slug}`,
    method: 'GET',
  });
};

const getFeaturedArticles = async (params?: IParamsGetArticles) => {
  return fetcherWithMetadata<IHealthArticle[]>({
    url: path.getFeaturedArticles,
    params,
    method: 'GET',
  });
};

type RelatedArticlesQueryParams = QueryParam & {
  articleId: string;
};

const getRelatedArticles = async (params: RelatedArticlesQueryParams) => {
  return fetcher<IHealthArticle[]>({
    url: `/articles/related`,
    params,
    method: 'GET',
  });
};

const searchArticles = async (params: QueryParam & { search: string }) => {
  return fetcherWithMetadata<IHealthArticle[]>({
    url: path.getArticles,
    params,
    method: 'GET',
  });
};

const getArticles = async (params: IParamsGetArticles) => {
  return fetcherWithMetadata<IHealthArticle[]>({
    url: '/articles',
    params,
    method: 'GET',
  });
};

const createArticle = async (data: FormData) => {
  return fetcher<IHealthArticle>(
    {
      url: '/articles',
      method: 'POST',
      data,
      timeout: 60000,
    },
    { isFormData: true }
  );
};

const updateArticle = async (id: string, data: FormData) => {
  return fetcher<IHealthArticle>(
    {
      url: `/articles/${id}`,
      method: 'PATCH',
      data,
      timeout: 60000,
    },
    { isFormData: true }
  );
};

const deleteArticle = async (id: string) => {
  return fetcher<void>({
    url: `/articles/${id}`,
    method: 'DELETE',
    timeout: 60000,
  });
};

const sendArticleForReview = async (id: string) => {
  return fetcher<IHealthArticle>({
    url: `/articles/send-for-review/${id}`,
    method: 'POST',
  });
};

const rejectArticle = async (id: string, reason: string) => {
  return fetcher<IHealthArticle>({
    url: `/articles/reject-review/${id}`,
    method: 'POST',
    data: { reason },
  });
};

const approveArticle = async (id: string) => {
  return fetcher<IHealthArticle>({
    url: `/articles/approve-review/${id}`,
    method: 'POST',
  });
};

const requestEditArticle = async (id: string, assigneeId: string) => {
  return fetcher<IHealthArticle>({
    url: `/articles/request-edit/${id}`,
    method: 'POST',
    data: { assigneeId },
  });
};

export default {
  getArticleBySlug,
  getArticleById,
  getRelatedArticles,
  searchArticles,
  getArticles,
  getFeaturedArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  sendArticleForReview,
  rejectArticle,
  approveArticle,
  requestEditArticle,
};
