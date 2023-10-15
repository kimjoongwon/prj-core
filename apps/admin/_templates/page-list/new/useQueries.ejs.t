---
to: src/app/admin/(dashboard)/<%= h.inflection.pluralize(name) %>/components/PageProvider/hooks/useQueries.ts
---
import { useUsersQuery } from '@hooks';
import { useState } from './useState';
import { useMemo } from 'react';

export const useQueries = (state: ReturnType<typeof useState>) => {
  const usersQuery = useUsersQuery({ ...state.query });
  return {
    usersQuery: useMemo(() => usersQuery, [{ ...state.query }]),
  };
};
