import { useCategoryItemTreesQuery } from '@hooks';

export const useQueries = () => {
  const categoryItemTreesQuery = useCategoryItemTreesQuery();

  return {
    categoryItemTreesQuery,
  };
};
