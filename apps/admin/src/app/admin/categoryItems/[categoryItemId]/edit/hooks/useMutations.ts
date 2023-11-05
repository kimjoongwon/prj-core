import {
  useCoCRouter,
  useCreateCategoryItem,
  useDeleteCategoryItem,
  useUpdateCategoryItem,
} from '@hooks';

export const useMutations = () => {
  const router = useCoCRouter();
  const [updateCategoryItem] = useUpdateCategoryItem({
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
