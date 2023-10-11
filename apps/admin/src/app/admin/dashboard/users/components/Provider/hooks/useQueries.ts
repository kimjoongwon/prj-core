import { useUsersQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = (state: ReturnType<typeof useState>) => {
  const usersQuery = useUsersQuery({ ...state.query });
  console.log('usersQuery', usersQuery);
  // console.log('test', error?.message);

  return {
    usersQuery,
  };
};
