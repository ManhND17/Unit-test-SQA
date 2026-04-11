import { ICategory } from 'src/types';
import { fetcherWithMetadata, QueryParam } from './Fetcher';

const path = {
  getCategories: '/categories',
  getCategoryBySlug: '/categories/slug',
  getCategoryById: '/categories',
  getCategoriesTree: '/categories/tree',
};

const getCategories = async (params?: QueryParam) => {
  return fetcherWithMetadata<ICategory[]>({
    url: path.getCategories,
    method: 'GET',
    params,
  });
};

const addCategory = async (name: string, description: string) => {
  return fetcherWithMetadata<ICategory>({
    url: path.getCategories,
    method: 'POST',
    data: { name, description },
  });
};

export default {
  getCategories,
  addCategory,
};
