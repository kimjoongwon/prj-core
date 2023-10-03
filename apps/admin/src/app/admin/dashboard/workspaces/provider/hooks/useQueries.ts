import { useUsersQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = (state: ReturnType<typeof useState>) => {
  const userQuery = useUsersQuery({
    skip: state.table.pagination.skip,
    take: state.table.pagination.take,
    sortingKey: state.table.sorting.key,
    sortingValue: state.table.sorting.value,
  });

  return {
    userQuery,
  };
};
