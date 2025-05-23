import { createResourceApiHooks } from '@/core/helpers/createApiResource';

export interface Developer {
  id?: number;
  name: string;
  description: string;
  photo?: string | File;
}

const DEVELOPER_URL = 'developers/';

export const {
  useGetResources: useGetDevelopers,
  useGetResource: useGetDeveloper,
  useCreateResource: useCreateDeveloper,
  useUpdateResource: useUpdateDeveloper,
  useDeleteResource: useDeleteDeveloper,
} = createResourceApiHooks<Developer>(DEVELOPER_URL, 'developers');
