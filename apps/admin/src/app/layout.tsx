import './globals.css';
import { Providers } from './providers';
import localFont from 'next/font/local';

const pretendard = localFont({
  src: '../../static/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

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
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
