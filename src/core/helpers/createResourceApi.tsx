import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  type QueryKey
} from '@tanstack/react-query';
import api from '@/core/api/api';

interface ResourceApiHooks<T> {
  useGetResources: () => { 
    data: T[] | undefined; 
    isLoading: boolean; 
    error: unknown 
  };
  useGetResource: (id: number) => { 
    data: T | undefined; 
    isLoading: boolean; 
    error: unknown 
  };
  useCreateResource: () => {
    mutateAsync: (data: T) => Promise<T>;
    isPending: boolean;
    error: unknown;
  };
  useUpdateResource: () => {
    mutateAsync: (data: T & { id: number }) => Promise<T>;
    isPending: boolean;
    error: unknown;
  };
  useDeleteResource: () => {
    mutateAsync: (id: number) => Promise<void>;
    isPending: boolean;
    error: unknown;
  };
}

export function createResourceApiHooks<T>(endpoint: string, queryKey: QueryKey): ResourceApiHooks<T> {
  return {
    useGetResources: () => {
      return useQuery({
        queryKey: [queryKey],
        queryFn: async () => {
          const response = await api.get<T[]>(endpoint);
          return response.data;
        },
      });
    },

    useGetResource: (id: number) => {
      return useQuery({
        queryKey: [queryKey, id],
        queryFn: async () => {
          const response = await api.get<T>(`${endpoint}${id}/`);
          return response.data;
        },
      });
    },

    useCreateResource: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (data: T) => {
          const response = await api.post<T>(endpoint, data);
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
      });
    },

    useUpdateResource: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (data: T & { id: number }) => {
          const { id, ...rest } = data;
          const response = await api.put<T>(`${endpoint}${id}/`, rest);
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
      });
    },

    useDeleteResource: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (id: number) => {
          await api.delete(`${endpoint}${id}/`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
      });
    },
  };
}
