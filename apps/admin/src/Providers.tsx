'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { AppProvider, QueryProvider } from '@shared/frontend';
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
          <AppProvider>
            {children}
            {/* <ModalMount /> */}
          </AppProvider>
          <ToastProvider placement="top-center" />
        </NuqsAdapter>
        {/* <ToastProvider /> */}
      </HeroUIProvider>
    </QueryProvider>
  );
};
