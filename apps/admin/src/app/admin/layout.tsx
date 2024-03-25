'use client';

import { useCoCRouter } from '@hooks';
import { CoCNavbar, Container, useGetMemus } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { useAdminServiceGetMemus } from '../../api/queries';

function Layout({ children }: { children: React.ReactNode }) {
  const { data } = useGetMemus();
  const router = useCoCRouter();
  // const { data: menus } = useAdminServiceGetMemus();

  return (
    <Container>
      <CoCNavbar />
      {children}
    </Container>
  );
}

export default observer(Layout);
