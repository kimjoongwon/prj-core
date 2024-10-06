import { useCreateCategory, useUpdateCategory } from '@shared/frontend';

export const useMutations = () => {
  return {
    createCategory: useCreateCategory(),
    updateCategory: useUpdateCategory(),
  };
};
