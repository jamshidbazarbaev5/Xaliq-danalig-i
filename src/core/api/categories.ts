import { createResourceApiHooks } from '@/core/helpers/createApiResource';
export interface Category {
  id?: number;
  name_cyr: string;
  name_lat: string;
  description_cyr: string;
  description_lat: string;
  parent: number | null;
}

const CATEGORY_URL = 'categories/';

// Create category API hooks using the factory function
export const {
  useGetResources: useGetCategories,
  useGetResource: useGetCategory,
  useCreateResource: useCreateCategory,
  useUpdateResource: useUpdateCategory,
  useDeleteResource: useDeleteCategory,
} = createResourceApiHooks<Category>(CATEGORY_URL, 'categories');
