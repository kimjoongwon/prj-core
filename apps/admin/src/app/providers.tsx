'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ApolloWrapper } from './shared/libs/apollo-wrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ApolloWrapper>{children}</ApolloWrapper>
    </NextUIProvider>
  );
}
