import { useGetCategoriesByQuerySuspense } from '@shared/frontend';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { data: getCategoriesByQueryResponse } =
    useGetCategoriesByQuerySuspense({ serviceId, take: 4 });

  return {
    categories: getCategoriesByQueryResponse.data || [],
    totalCount: getCategoriesByQueryResponse.meta?.itemCount,
  };
};
