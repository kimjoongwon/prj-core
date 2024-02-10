'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@providers';
import { ModalMount } from '@modals';
import { ApolloWrapper } from '@libs';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
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
