import { useRolesQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  return {
    rolesQuery: useRolesQuery(state.query),
  };
};
