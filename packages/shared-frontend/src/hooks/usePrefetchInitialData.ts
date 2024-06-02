import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  getAllService,
  getAllSpace,
  getGetAllServiceQueryKey,
  getGetAllSpaceQueryKey,
} from '../apis';

export const usePrefechInitialData = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: getGetAllServiceQueryKey(),
      queryFn: getAllService,
    });

    queryClient.prefetchQuery({
      queryKey: getGetAllSpaceQueryKey(),
      queryFn: getAllSpace,
    });
  }, []);
};
