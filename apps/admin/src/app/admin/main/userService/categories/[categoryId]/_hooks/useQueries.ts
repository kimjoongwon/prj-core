import { useGetCategoryById, useUpdateCategory } from '@shared/frontend';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: queryData, isLoading: isGetCategoryByIdLoading } =
    useGetCategoryById(categoryId, {
      query: {
        enabled: !!categoryId,
      },
    });
  const { mutateAsync: updateCategory } = useUpdateCategory();

  return {
    isGetCategoryByIdLoading,
    updateCategory,
    category: queryData?.data,
  };
};
