import { useSpacesQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  return {
    spacesQuery: useSpacesQuery(state.query),
  };
};
