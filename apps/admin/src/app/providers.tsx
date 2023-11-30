'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ApolloWrapper } from './shared/libs/apollo-wrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ModalMount, ModalProvider } from '@coc/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ModalProvider>
        <ApolloWrapper>
          {children}
          <ModalMount />
        </ApolloWrapper>
      </ModalProvider>
      <ToastContainer theme="dark" />
    </NextUIProvider>
  );
}
