import { useWorkspacesQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = (state: ReturnType<typeof useState>) => {
  const workspacesQuery = useWorkspacesQuery({
    skip: state.table.pagination.skip,
    take: state.table.pagination.take,
  });

  return {
    workspacesQuery,
  };
};
