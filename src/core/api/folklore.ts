import { createResourceApiHooks } from "@/core/helpers/createApiResource";

export interface Book {
  id?: number;
  title_cyr: string;
  title_lat: string;
  description_cyr: string;
  description_lat: string;
  cover_image: File | string;
  epub_file_cyr: File | string | null;
  epub_file_lat: File | string | null;
  publication_year: number;
  publisher: string;
  is_active: boolean;
  order: number;
  categories: {
    id: number;
    name_cyr: string;
    name_lat: string;
  }[];
  authors: {
    id: number;
    name_cyr: string;
    name_lat: string;
  }[];
}

const FOLKLOR_URL = "folklore/";

// Create books API hooks using the factory function
export const {
  useGetResources: useGetFolklors,
  useGetResource: useGetFolklor,
  useCreateResource: useCreateFolklor,
  useUpdateResource: useUpdateFolklor,
  useDeleteResource: useDeleteFolkor,
} = createResourceApiHooks<Book>(FOLKLOR_URL, "folklor");
