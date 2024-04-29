'use client';

import { NextUIProvider } from '@nextui-org/react';
import { InitContainer, AuthController } from '@components';
import { ToastContainer } from 'react-toastify';
import { ModalMount } from '@shared/frontend';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <InitContainer>
        <AuthController>
          {children}
          <ModalMount />
        </AuthController>
      </InitContainer>
      <ToastContainer theme="dark" />
    </NextUIProvider>
  );
}
