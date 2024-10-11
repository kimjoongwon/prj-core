import { useGetSessionsByQuerySuspense } from '@shared/frontend';

export const useQueries = () => {
  const { data: getSessionsByQueryResponse } = useGetSessionsByQuerySuspense();
  return {
    sessions: getSessionsByQueryResponse.data || [],
  };
};
