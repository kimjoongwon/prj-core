import { useCategoryFormQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { id = 'new' } = useParams();
  const categoryFormQuery = useCategoryFormQuery({
    id: id as string,
  });

  return {
    categoryFormQuery,
  };
};
