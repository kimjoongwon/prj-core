import { useCategoryFormQuery, useCategoryQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { id = 'new' } = useParams();
  const categoryFormQuery = useCategoryFormQuery({ id: id as string });
  const categoryQuery = useCategoryQuery({ id: id as string });

  return {
    categoryFormQuery,
    categoryQuery,
  };
};
