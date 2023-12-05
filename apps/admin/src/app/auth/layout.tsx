import { LoginForm } from '@coc/ui';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-4">{children}</div>;
}
