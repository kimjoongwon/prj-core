import { useCoCRouter, useDeleteCategory } from '@hooks';

export const useMutations = () => {
  const router = useCoCRouter();
  const [deleteCategory] = useDeleteCategory({
    onCompleted: () => router.back(),
  });

  return {
    deleteCategory,
  };
};
