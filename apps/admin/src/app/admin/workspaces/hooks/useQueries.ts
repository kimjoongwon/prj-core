import { useWorkspacesQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  const workspacesQuery = useWorkspacesQuery(state.query);
  console.log('workspacesQuery', workspacesQuery);
  return {
    workspacesQuery,
  };
};
