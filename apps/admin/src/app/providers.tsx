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
  useEffect(() => {
    // @ts-ignore
    if (window.EmbedApi) {
      alert('test');
    }

    window.addEventListener('message', event => {
      console.log(event);
      alert(event.data);
    });
    document.addEventListener('message', event => {
      console.log(event);
      // @ts-ignore
      alert(event.data);
    });
  });

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
