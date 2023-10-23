import { useCategoriesQuery } from '@hooks';
import { useStates } from './useStates';
import { useMemo } from 'react';

export const useQueries = (state: ReturnType<typeof useStates>) => {
  const categoriesQuery = useCategoriesQuery({ ...state.query });
  return {
    categoriesQuery: useMemo(() => categoriesQuery, [{ ...state.query }]),
  };
};
