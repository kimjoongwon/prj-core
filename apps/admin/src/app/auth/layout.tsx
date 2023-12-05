import { LoginForm } from '@coc/ui';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-8">{children}</div>;
}
