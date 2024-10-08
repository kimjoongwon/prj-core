import {
  getGetCategoriesByQueryQueryKey,
  useCreateCategory,
  useGetAllServiceSuspense,
  useGetCategoriesByQuerySuspense,
  useUpdateCategory,
} from '@shared/frontend';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const queryClient = useQueryClient();
  const { data: services } = useGetAllServiceSuspense();
  const { data: queryData } = useGetCategoriesByQuerySuspense(
    { serviceId },
    { query: { refetchOnMount: true } },
  );
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
