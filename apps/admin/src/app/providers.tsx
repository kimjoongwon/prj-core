'use client';
import { NextUIProvider } from '@nextui-org/react';
import { ApolloWrapper } from './shared/libs/apollo-wrapper';
import { ToastContainer } from 'react-toastify';
import { ModalMount, ModalProvider } from '@coc/ui';
import { AuthProvider } from '@providers';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ModalProvider>
        <ApolloWrapper>
          <AuthProvider>
            {children}
            <ModalMount />
          </AuthProvider>
        </ApolloWrapper>
      </ModalProvider>
      <ToastContainer theme="dark" />
    </NextUIProvider>
  );
}
