import {
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

  const { data: getClassificationByQueryResponse } =
    useGetClassificationsByQuerySuspense(state.classificationsTable.query);

  const { data: getSpacesByQueryResponse } = useGetSpacesByQuerySuspense(
    state.spacesTable.query,
  );

  const { data: getCategoryByIdResponse } =
    useGetCategoryByIdSuspense(categoryId);

  const { data: getServiceResponse } = useGetServiceSuspense(serviceId);

  return {
    classifications: getClassificationByQueryResponse.data || [],
    spaces: getSpacesByQueryResponse.data || [],
    category: getCategoryByIdResponse.data,
    service: getServiceResponse.data,
  };
};
