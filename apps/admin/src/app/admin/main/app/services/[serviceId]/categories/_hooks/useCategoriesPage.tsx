import { useQueries } from './useQueries';

export const useCategoriesPage = () => {
  const queries = useQueries();

  return {
    queries,
  };
};
