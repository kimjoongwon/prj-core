import { LoginForm } from '@coc/ui';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      AuthLayout
      <div>{children}</div>
    </div>
  );
}
