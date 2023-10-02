import { PageProvider } from './edit/components/providers/page';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageProvider>{children}</PageProvider>;
}
