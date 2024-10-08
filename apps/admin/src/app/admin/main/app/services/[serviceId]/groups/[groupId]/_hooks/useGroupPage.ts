import { useHandlers } from './useHandlers';
import { useQueries } from './useQueries';

export const useGroupPage = () => {
  const queries = useQueries();
  const handlers = useHandlers({ queries });
  const { onClickAdd, onClickAddToGroup, onClickCancel } = handlers;
  return {
    queries,
    onClickAdd,
    onClickAddToGroup,
    onClickCancel,
  };
};
