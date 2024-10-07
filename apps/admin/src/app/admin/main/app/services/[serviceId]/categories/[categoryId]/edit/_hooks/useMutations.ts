import {
  getGetCategoriesByQueryQueryKey,
  useCreateCategory,
  useUpdateCategory,
} from '@shared/frontend';
import { useQueryClient } from '@tanstack/react-query';

export const useMutations = () => {
  const queryClient = useQueryClient();
  return {
    createCategory: useCreateCategory(),
    updateCategory: useUpdateCategory(),
    invalidateCategories: () =>
      queryClient.invalidateQueries({
        queryKey: getGetCategoriesByQueryQueryKey(),
      }),
  };
};
