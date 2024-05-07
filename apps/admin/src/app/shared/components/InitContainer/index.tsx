import {
  getAccessibleAllSpace,
  getAllService,
  getAllSpace,
  getGetAccessibleAllSpaceQueryKey,
  getGetAllServiceQueryKey,
  getGetAllSpaceQueryKey,
  router,
} from '@shared/frontend';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface InitContainerProps {
  children: React.ReactNode;
}

let browserQueryClient: QueryClient | undefined = undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 0,
      },
    },
  });
}

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // supsends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const InitContainer = (props: InitContainerProps) => {
  const { children } = props;
  const queryClient = getQueryClient();
  const nextRouter = useRouter();

  useEffect(() => {
    // 초기 Prefetch
    queryClient.prefetchQuery({
      queryKey: getGetAllServiceQueryKey(),
      queryFn: getAllService,
    });

    // queryClient.prefetchQuery({
    //   queryKey: getGetAccessibleAllSpaceQueryKey(),
    //   queryFn: getAccessibleAllSpace,
    // });

    queryClient.prefetchQuery({
      queryKey: getGetAllSpaceQueryKey(),
      queryFn: getAllSpace,
    });

    // 초기 라우터
    router.setRouter(nextRouter);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
