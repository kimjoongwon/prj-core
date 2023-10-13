'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ApolloWrapper } from './shared/libs/apollo-wrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ApolloWrapper>{children}</ApolloWrapper>
      <ToastContainer theme="dark" />
    </NextUIProvider>
  );
}
