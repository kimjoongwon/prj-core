import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getAllService, getGetAllServiceQueryKey } from '../apis';

export const usePrefechInitialData = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: getGetAllServiceQueryKey(),
      queryFn: getAllService,
    });
  }, []);
};
