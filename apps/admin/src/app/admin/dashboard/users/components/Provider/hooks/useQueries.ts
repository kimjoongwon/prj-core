import { useUsersQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = (state: ReturnType<typeof useState>) => {
  const usersQuery = useUsersQuery({ ...state.query });
  return {
    usersQuery,
  };
};
