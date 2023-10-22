import { useState } from './useState';
import { useMemo } from 'react';

export const useQueries = (state: ReturnType<typeof useState>) => {
  return {
    // usersQuery: useMemo(() => usersQuery, [{ ...state.query }]),
    usersQuery: [],
  };
};
