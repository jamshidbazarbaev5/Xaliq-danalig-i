import { createResourceApiHooks } from '@/core/helpers/createApiResource';

export interface Author {
  id?: number;
  name_cyr: string;
  name_lat: string;
  biography_cyr: string;
  biography_lat: string;
  date_of_birth: string;
  date_of_death?: string;
  photo?: File;
}

const AUTHOR_URL = 'authors/';

// Create author API hooks using the factory function
export const {
  useGetResources: useGetAuthors,
  useGetResource: useGetAuthor,
  useCreateResource: useCreateAuthor,
  useUpdateResource: useUpdateAuthor,
  useDeleteResource: useDeleteAuthor,
} = createResourceApiHooks<Author>(AUTHOR_URL, 'authors');
