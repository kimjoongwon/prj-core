import { PageProvider } from '../providers/page';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageProvider>{children}</PageProvider>;
}
