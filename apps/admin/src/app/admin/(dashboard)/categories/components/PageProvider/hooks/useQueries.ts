import { useCategoriesQuery } from '@hooks';
import { useState } from './useState';
import { useMemo } from 'react';

export const useQueries = (state: ReturnType<typeof useState>) => {
  const categoriesQuery = useCategoriesQuery({ ...state.query });
  return {
    categoriesQuery: useMemo(() => categoriesQuery, [{ ...state.query }]),
  };
};
