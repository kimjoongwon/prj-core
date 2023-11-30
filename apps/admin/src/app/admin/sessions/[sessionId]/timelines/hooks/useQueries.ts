import { useTimelinesQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  return {
    timelinesQuery: useTimelinesQuery(state.query),
  };
};
