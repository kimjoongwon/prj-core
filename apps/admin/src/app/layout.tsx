'use client';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';

export default function RootLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <title>라프첼라</title>
      </head>
      <body>
        <Providers>
          {props.children}
          {props.modal}
        </Providers>
      </body>
      <Script
        onLoad={e => 'day' + alert(JSON.stringify(e))}
        onError={e =>
          alert(
            'day2' +
              JSON.stringify(e, ['message', 'arguments', 'type']),
          )
        }
        onReady={() => alert('ready')}
        src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"
      ></Script>
    </html>
  );
}
