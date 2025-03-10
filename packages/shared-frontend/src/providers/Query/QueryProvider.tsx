'use client';

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AXIOS_INSTANCE } from '../../libs/customAxios';

interface InitContainerProps {
  children: React.ReactNode;
}

let browserQueryClient: QueryClient | undefined = undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
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
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
