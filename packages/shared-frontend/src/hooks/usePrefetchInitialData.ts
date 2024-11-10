'use client';

import { useEffect } from 'react';
// import { getAllService, getGetAllServiceQueryKey } from '../apis';

export const usePrefechInitialData = () => {
  useEffect(() => {
    // queryClient.prefetchQuery({
    //   queryKey: getGetAllServiceQueryKey(),
    //   queryFn: getAllService,
    // });
  }, []);
};
