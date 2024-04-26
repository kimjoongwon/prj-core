'use client';

import {
  Container,
  useGetAllService,
  NavItem,
  Navbar,
  authStore,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { navStore } from '@stores';

interface AdminLayoutProps {
  children: React.ReactNode;
  auth: React.ReactNode;
  service: React.ReactNode;
}

const AdminLayout = observer((props: AdminLayoutProps) => {
  const { auth, children, service } = props;
  const { data: services } = useGetAllService();

  const navItems: NavItem[] = [
    {
      button: { children: '유저 카테고리' },
      link: {
        href: navStore.getUrlWithParamsAndQueryString(
          '/admin/services/:serviceId/categories',
          {
            serviceId:
              services?.find(service => service.name === 'USER')?.id || '',
          },
        ),
      },
    },
  ];

  return (
    <Container>
      <Navbar navItems={navItems}>
        {authStore.accessToken ? auth : service}
        {children}
      </Navbar>
    </Container>
  );
});

export default AdminLayout;
