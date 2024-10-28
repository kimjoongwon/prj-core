import { useGetCategoriesByQuerySuspense } from '@shared/frontend';
import { useState } from './useState';

export const useQueries = (context: { state: ReturnType<typeof useState> }) => {
  const { state } = context;
  console.log('??');
  const { data: getCategoriesByQueryResponse } =
    useGetCategoriesByQuerySuspense(state.query);

  return {
    categories: getCategoriesByQueryResponse.data || [],
    totalCount: getCategoriesByQueryResponse.meta?.itemCount,
  };
};
