'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { ReactQueryProvider } from '@shared/frontend';
import { Store } from '../../../../packages/shared-services';
import { observer } from 'mobx-react-lite';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ServiceProvider } from '../services/provider';

interface ProvidersProps {
  children: React.ReactNode;
}

let store: Store;
export const Providers = observer((props: ProvidersProps) => {
  const { children } = props;

  return (
    <ReactQueryProvider>
      <HeroUIProvider>
        <NuqsAdapter>
          <ServiceProvider>
            {children}
            <ToastProvider />
          </ServiceProvider>
        </NuqsAdapter>
      </HeroUIProvider>
    </ReactQueryProvider>
  );
});
