import { useCategoryItemFormQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { categoryItemId = 'new' } = useParams();
  console.log('categoryItemId', categoryItemId);
  const categoryItemFormQuery = useCategoryItemFormQuery({
    id: categoryItemId as string,
  });

  return {
    categoryItemFormQuery,
  };
};
