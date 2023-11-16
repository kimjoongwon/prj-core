import { useGroupsQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  return {
    groupsQuery: useGroupsQuery(state.query),
  };
};
