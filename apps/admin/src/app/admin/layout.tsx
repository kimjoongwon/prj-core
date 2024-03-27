'use client';

import { CoCNavbar, Container, useGetMemus } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { menuStore } from '@stores';

function Layout({ children }: { children: React.ReactNode }) {
  const { data: menuData } = useGetMemus();
  const menus = menuData?.data;
  console.log('menus', menus);
  return (
    <Container>
      <CoCNavbar navItems={menus} state={menuStore} />
      {children}
    </Container>
  );
}

export default observer(Layout);
