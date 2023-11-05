import { useDeleteCategoryItem } from '@hooks';

export const useMutations = () => {
  return {
    deleteCategoryItem: useDeleteCategoryItem(),
  };
};
