import type { Metadata } from 'next';
import { ReactQueryProvider } from '@shared/frontend';
import { Providers } from './providers';
import './globals.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const metadata: Metadata = {
  title: '시퀸스',
  description: 'Find Your Next Favorite Sequence',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>
          <ReactQueryProvider>
            <Providers>{children}</Providers>
          </ReactQueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
