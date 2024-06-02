import { AppProvider, ReactQueryProvider } from '@shared/frontend';


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AppProvider>{children}</AppProvider>
    </ReactQueryProvider>
  );
}
