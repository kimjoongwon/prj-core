import { useDeleteCategories, useRemoveCategory } from '@hooks';

export const useMutations = () => {
  const [deleteCategories] = useDeleteCategories();
  const [removeCategory] = useRemoveCategory();
  return {
    deleteCategories,
    removeCategory,
  };
};
