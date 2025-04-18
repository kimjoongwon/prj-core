import type { Metadata } from 'next';
import { Providers } from './providers';
import localFont from 'next/font/local';
import './globals.css';

export const metadata: Metadata = {
  title: '시퀸스',
  description: 'Find Your Next Favorite Sequence',
  icons: {
    icon: '/favicon.ico',
  },
};

const myFont = localFont({
  src: [
    {
      path: './fonts/RiaSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/RiaSans-Bold.ttf',
      weight: '700',
      style: 'bold',
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={myFont.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
