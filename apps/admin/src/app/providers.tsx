'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ApolloWrapper } from './shared/libs/apollo-wrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ModalMount, ModalProvider } from '@coc/ui';
import { AccountProvider } from './shared/providers/AccountProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ModalProvider>
        <ApolloWrapper>
          <AccountProvider>
            {children}
            <ModalMount />
          </AccountProvider>
        </ApolloWrapper>
      </ModalProvider>
      <ToastContainer theme="dark" />
    </NextUIProvider>
  );
}
