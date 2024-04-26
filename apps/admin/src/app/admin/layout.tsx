'use client';

import { Container, useGetAllService, NavItem, Navbar } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { navStore } from '@stores';

const AdminLayout = observer(({ children }: { children: React.ReactNode }) => {
  const { data: services } = useGetAllService();

  const navItems: NavItem[] = [
    {
      button: { children: '유저 카테고리' },
      link: {
        href: navStore.getUrlWithParamsAndQueryString(
          '/admin/services/:serviceId/categories',
          {
            serviceId: services?.find(service => service.name === 'USER')?.id,
          },
        ),
      },
    },
  ];

  return (
    <Container>
      <Navbar navItems={navItems}>{children}</Navbar>
    </Container>
  );
});

export default AdminLayout;
