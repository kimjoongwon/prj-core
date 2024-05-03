import {
  useCreateCategory,
  useGetCategories,
  useUpdateCategory,
} from '@shared/frontend';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { data: queryData, isLoading } = useGetCategories();
  const { mutateAsync: createCategory, isSuccess } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  return {
    isSuccess,
    createCategory,
    updateCategory,
    categories: queryData?.data.filter(
      category => category.serviceId === serviceId,
    ),
    isLoading,
  };
};
