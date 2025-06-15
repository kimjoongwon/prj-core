'use client';

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AXIOS_INSTANCE } from '@shared/api-client';

interface InitContainerProps {
  children: React.ReactNode;
}

let browserQueryClient: QueryClient | undefined = undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        gcTime: 0,
      },
    },
  });
}

AXIOS_INSTANCE.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (!window.location.pathname.includes('/auth')) {
      if (error.response?.status === 401) {
        window.location.href = '/admin/auth/login';
        return undefined;
      }
    }
    return Promise.reject(error);
  },
);

AXIOS_INSTANCE.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export const QueryProvider = (props: InitContainerProps) => {
  const { children } = props;
  const queryClient = makeQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools position="top" />
    </QueryClientProvider>
  );
};
