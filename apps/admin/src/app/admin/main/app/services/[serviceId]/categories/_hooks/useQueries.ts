import {
  getGetCategoriesByQueryQueryKey,
  useCreateCategory,
  useGetAllServiceSuspense,
  useGetCategoriesByQuerySuspense,
  useUpdateCategory,
} from '@shared/frontend';
import { useQueryClient } from '@tanstack/react-query';

export const useQueries = () => {
  const queryClient = useQueryClient();
  const { data: services } = useGetAllServiceSuspense();
  const { data: queryData } = useGetCategoriesByQuerySuspense();
  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  return {
    createCategory,
    updateCategory,
    services,
    categories: queryData.data || [],
    invalidateGetCategories: () =>
      queryClient.invalidateQueries({
        queryKey: getGetCategoriesByQueryQueryKey(),
      }),
  };
};
