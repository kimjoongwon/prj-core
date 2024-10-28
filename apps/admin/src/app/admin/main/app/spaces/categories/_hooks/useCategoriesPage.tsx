import { useQueries } from './useQueries';
import { useState } from './useState';

export const useCategoriesPage = () => {
  const state = useState();
  const queries = useQueries({ state });

  return {
    queries,
    state,
  };
};
