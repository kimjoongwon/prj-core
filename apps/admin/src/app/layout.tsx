'use client';

import './globals.css';
import { Providers } from './providers';
import localFont from 'next/font/local';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AppLayout, ModalMount } from '@shared/frontend';

const pretendard = localFont({
  src: '../../static/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

// if (process.env.NODE_ENV === 'development') {
//   if (isServer) {
//     (async () => {
//       const { server } = await import('../mocks/node');
//       server.listen();
//     })();
//   } else {
//     (async () => {
//       const { worker } = await import('../mocks/browser');
//       // @ts-ignore
//       worker?.start();
//     })();
//   }
// }

export default function RootLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="kr" className={`light ${pretendard.variable}`}>
      <head>
        <title>라프첼라</title>
      </head>
      <body>
        <AppLayout>
          <Providers>
            {props.children}
            <ModalMount />
            <ToastContainer />
          </Providers>
        </AppLayout>
      </body>
    </html>
  );
}
