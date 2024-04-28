'use client';

import { Container } from '@shared/frontend';
import { observer } from 'mobx-react-lite';

interface AdminLayoutProps {
  children: React.ReactNode;
  auth: React.ReactNode;
  service: React.ReactNode;
}

const AdminLayout = observer((props: AdminLayoutProps) => {
  const { children } = props;

  return <Container>{children}</Container>;
});

export default AdminLayout;
