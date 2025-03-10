'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { QueryProvider } from '@shared/frontend';
import { AppProvider } from '@shared/frontend';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

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
            <ToastProvider />
          </AppProvider>
        </NuqsAdapter>
      </HeroUIProvider>
    </QueryProvider>
  );
};
