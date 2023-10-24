import { useCategoryItemFormQuery, useCategoryItemQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { id = 'new' } = useParams();
  const categoryItemQuery = useCategoryItemQuery({ id: id as string });
  const categoryItemFormQuery = useCategoryItemFormQuery();

  return {
    categoryItemFormQuery,
    categoryItemQuery,
  };
};
