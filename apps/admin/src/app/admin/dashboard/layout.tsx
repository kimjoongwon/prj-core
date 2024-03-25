'use client';

import React from 'react';
import { CoCNavbar, Container, useGetMemus } from '@shared/frontend';
import { menuStore } from '@stores';
import { observer } from 'mobx-react-lite';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = observer((props: DashboardLayoutProps) => {
  const { data: menuData } = useGetMemus();
  const menus = menuData?.data;
  const menuItems = menus?.find(
    menu => menu.pathname === 'admin/service',
  )?.children;
  console.log('menus', menus);
  return (
    <Container>
      <CoCNavbar navItems={menus} state={menuStore} />
      <div>{menuItems?.map(menu => <div>{menu.text}</div>)}</div>
      {props.children}
    </Container>
  );
});

export default DashboardLayout;
