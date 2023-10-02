import { PageProvider } from './provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageProvider>{children}</PageProvider>;
}
