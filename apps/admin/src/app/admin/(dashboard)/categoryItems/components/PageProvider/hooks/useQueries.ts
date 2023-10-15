import { useCategoryItemsQuery } from '@hooks';
import { useState } from './useState';
import { useMemo } from 'react';

export const useQueries = (state: ReturnType<typeof useState>) => {
  const categoryItemsQuery = useCategoryItemsQuery({ ...state.query });
  return {
    categoryItemsQuery: useMemo(() => categoryItemsQuery, [{ ...state.query }]),
  };
};
