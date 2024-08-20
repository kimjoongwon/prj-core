import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AXIOS_INSTANCE } from '../../libs/customAxios';
import { galaxy } from '../App';

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

export function getQueryClient() {
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

AXIOS_INSTANCE.interceptors.request.use(
  function (config) {
    const token = `Bearer ${galaxy?.auth?.accessToken}`;
    const tenantId = galaxy?.auth?.user?.tenants?.[0]?.id || '';
    // Do something before request is sent
    config.headers.Authorization = token;
    config.headers.tenantId = tenantId;

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

export const ReactQueryProvider = (props: InitContainerProps) => {
  const { children } = props;
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
