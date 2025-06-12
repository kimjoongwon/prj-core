'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { AppProvider, AuthProvider, QueryProvider } from '@shared/frontend';
import { NuqsAdapter } from 'nuqs/adapters/react';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = (props: ProvidersProps) => {
  const { children } = props;

  return (
    <QueryProvider>
      <HeroUIProvider>
        <NuqsAdapter>
          <AuthProvider>
            <AppProvider>
              {children}
              {/* <ModalMount /> */}
            </AppProvider>
          </AuthProvider>
          <ToastProvider placement="top-center" />
        </NuqsAdapter>
        {/* <ToastProvider /> */}
      </HeroUIProvider>
    </QueryProvider>
  );
};
