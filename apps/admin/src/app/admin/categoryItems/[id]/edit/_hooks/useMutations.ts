import {
  useCoCRouter,
  useCreateCategoryItem,
  useDeleteCategoryItem,
} from '@hooks';

export const useMutations = () => {
  const router = useCoCRouter();
  const [updateCategoryItem] = useCreateCategoryItem({
    onCompleted: () => router.back(),
  });
  const [deleteCategoryItem] = useDeleteCategoryItem({
    onCompleted: () => router.back(),
  });
  const [createCategoryItem] = useCreateCategoryItem({
    onCompleted: () => router.back(),
  });
  return {
    updateCategoryItem,
    deleteCategoryItem,
    createCategoryItem,
  };
};
