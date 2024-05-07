import {
  useCreateCategory,
  useGetAllService,
  useGetCategories,
  useUpdateCategory,
} from '@shared/frontend';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  // const { serviceId } = useParams<{ serviceId: string }>();
  const { data: services } = useGetAllService();
  const { data: queryData, isLoading } = useGetCategories();
  const { mutateAsync: createCategory, isSuccess } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const userService = services?.find(service => service.name === 'USER');
  console.log('queryData', queryData);

  return {
    isSuccess,
    createCategory,
    updateCategory,
    categories: queryData?.data.filter(
      category => category.serviceId === userService?.id,
    ),
    isLoading,
  };
};
