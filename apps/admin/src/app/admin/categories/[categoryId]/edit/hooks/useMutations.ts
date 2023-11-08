import {
  useCoCRouter,
  useCreateCategory,
  useUpdateCategory,
} from '@hooks';

export const useMutations = () => {
  const router = useCoCRouter();
  return {
    createCategory: useCreateCategory({
      onCompleted: () => {
        router.back();
      },
    }),
    updateCategory: useUpdateCategory({
      onCompleted: () => {
        router.back();
      },
    }),
  };
};
