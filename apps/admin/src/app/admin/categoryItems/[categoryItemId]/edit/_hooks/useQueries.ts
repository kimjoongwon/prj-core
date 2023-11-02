import { useCategoryItemFormQuery, useCategoryItemQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { categoryItemId = 'new' } = useParams();
  const categoryItemFormQuery = useCategoryItemFormQuery({
    id: categoryItemId as string,
  });

  return {
    categoryItemFormQuery,
  };
};
