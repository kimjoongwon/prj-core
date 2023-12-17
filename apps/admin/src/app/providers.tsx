'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ApolloWrapper } from './shared/libs/apollo-wrapper';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@providers';
import { ModalMount } from '@modals';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ApolloWrapper>
        <AuthProvider>
          {children}
          <ModalMount />
        </AuthProvider>
      </ApolloWrapper>
      <ToastContainer theme="dark" />
    </NextUIProvider>
  );
}
