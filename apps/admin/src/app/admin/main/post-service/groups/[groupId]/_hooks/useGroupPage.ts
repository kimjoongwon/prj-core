import { useHandlers } from './useHandlers';
import { useQueries } from './useQueries';
import { useState } from './useState';

export const useGroupPage = () => {
  const queries = useQueries();
  const state = useState();
  const handlers = useHandlers({ queries, state });
  const { onClickAdd, onClickAddToGroup, onClickCancel } = handlers;

  return {
    queries,
    onClickAdd,
    onClickAddToGroup,
    onClickCancel,
  };
};
