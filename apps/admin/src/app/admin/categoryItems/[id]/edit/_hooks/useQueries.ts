import { useCategoryItemFormQuery, useCategoryItemQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { id = 'new' } = useParams();
  const categoryItemFormQuery = useCategoryItemFormQuery({
    id: id as string,
  });

  return {
    categoryItemFormQuery,
  };
};
