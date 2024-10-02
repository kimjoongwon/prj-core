import {
  getGetCategoriesQueryKey,
  useCreateCategory,
  useGetAllServiceSuspense,
  useGetCategoriesSuspense,
  useUpdateCategory,
} from '@shared/frontend';
import { useQueryClient } from '@tanstack/react-query';

export const useQueries = () => {
  const queryClient = useQueryClient();
  const { data: services } = useGetAllServiceSuspense();
  const { data: queryData } = useGetCategoriesSuspense();
  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  return {
    createCategory,
    updateCategory,
    services,
    categories: queryData.data || [],
    invalidateGetCategories: () =>
      queryClient.invalidateQueries({
        queryKey: getGetCategoriesQueryKey(),
      }),
  };
};
