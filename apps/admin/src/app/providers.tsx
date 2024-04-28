'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  ServiceEntity,
  _Modal,
  getAllService,
  getGetAllServiceQueryKey,
  router,
  serviceStore,
} from '@shared/frontend';
import { get } from 'http';
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
let browserQueryClient: QueryClient | undefined = undefined;

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

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const _router = useRouter();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: getGetAllServiceQueryKey(),
      queryFn: getAllService,
    });
    // const getServices = async () => {
    //   const services = await getAllService();
    //   // localStorage.setItem('services', JSON.stringify(services));
    // };

    // getServices();

    router.setRouter(_router);
  }, []);

  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <_Modal />
          {children}
        </AuthProvider>
      </QueryClientProvider>
      <ToastContainer theme="dark" />
    </NextUIProvider>
  );
}
