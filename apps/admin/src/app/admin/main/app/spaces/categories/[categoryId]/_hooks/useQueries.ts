import {
  useGetAncestorCategoriesSuspense,
  useGetCategoryByIdSuspense,
  useGetClassificationsByQuerySuspense,
  useGetServiceSuspense,
  useGetSpacesByQuerySuspense,
} from '@shared/frontend';
import { useState } from './useState';
import { useParams } from 'next/navigation';

export const useQueries = (context: { state: ReturnType<typeof useState> }) => {
  const { state } = context;
  const { categoryId = '', serviceId } = useParams<{
    categoryId: string;
    serviceId: string;
  }>();

  const { data: getClassificationByQueryResponse, refetch } =
    useGetClassificationsByQuerySuspense(state.classificationsTable.query);

  const { data: getSpacesByQueryResponse } = useGetSpacesByQuerySuspense(
    state.spacesTable.query,
  );

  const { data: getCategoryByIdResponse } =
    useGetCategoryByIdSuspense(categoryId);

  const { data: getServiceResponse } = useGetServiceSuspense(serviceId);

  const { data: getAncestorCategoriesResponse } =
    useGetAncestorCategoriesSuspense(categoryId);

  return {
    refetchClassifications: refetch,
    classifications: getClassificationByQueryResponse.data || [],
    spaces: getSpacesByQueryResponse.data || [],
    spacesTotalCount: getSpacesByQueryResponse.meta?.itemCount,
    category: getCategoryByIdResponse.data,
    service: getServiceResponse.data,
    ancestorCategories: getAncestorCategoriesResponse.data || [],
  };
};
