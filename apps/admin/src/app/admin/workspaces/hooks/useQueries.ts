import { useWorkspacesQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  return {
    workspacesQuery: useWorkspacesQuery(state.query),
  };
};
