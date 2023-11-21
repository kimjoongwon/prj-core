import { useSessionsQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  return {
    sessionsQuery: useSessionsQuery(state.query),
  };
};
