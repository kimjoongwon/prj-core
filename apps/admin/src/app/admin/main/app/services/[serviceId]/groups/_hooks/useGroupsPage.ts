import { useQueries } from './useQueries';
import { useState } from './useState';

export const useGroupsPage = () => {
  const state = useState();
  const queries = useQueries();

  return {
    state,
    queries,
  };
};
