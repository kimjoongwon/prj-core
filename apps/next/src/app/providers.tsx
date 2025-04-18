'use client';

import { ModalMount } from '@/components';
import { HeroUIProvider } from '@heroui/react';
import { QueryProvider } from '@shared/frontend';
import { AppProvider } from '@shared/frontend';
import { NuqsAdapter } from 'nuqs/adapters/next';

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
            <ModalMount />
          </AppProvider>
        </NuqsAdapter>
        {/* <ToastProvider /> */}
      </HeroUIProvider>
    </QueryProvider>
  );
};
