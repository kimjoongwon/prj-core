import { useHandlers } from './useHandlers';
import { useMutations } from './useMutations';
import { useQueries } from './useQueries';
import { useState } from './useState';

export const useCategoryPage = () => {
  const state = useState();
  const queries = useQueries({ state });
  const mutations = useMutations();
  const handlers = useHandlers({
    mutations,
    queries,
    state,
  });

  return {
    handlers,
    mutations,
    queries,
    state,
  };
};
