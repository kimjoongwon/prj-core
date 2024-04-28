'use client';

import {
  Avatar,
  Button,
  NavItem,
  Navbar,
  authStore,
  useGetAllService,
} from '@shared/frontend';
import { router } from '@shared/frontend';
import { find } from 'lodash-es';

interface ServicesLayoutProps {
  children: React.ReactNode;
}

const ServicesLayout = (props: ServicesLayoutProps) => {
  const { children } = props;
  const { navItems } = useMeta();

  return (
    <Navbar
      rightContents={
        <>
          <Avatar name={authStore.user?.email || 'test!'} />
          <Button color="danger" variant="flat">
            나가기
          </Button>
        </>
      }
      navItems={navItems}
    >
      {children}
    </Navbar>
  );
};

export default ServicesLayout;

export const useMeta = () => {
  const { data: services } = useGetAllService();

  const serviceId = find(services, { name: 'USER' })?.id;

  const serviceNavItems: NavItem[] =
    services?.map(service => {
      const href = router.getUrlWithParamsAndQueryString(
        '/admin/services/:serviceId/categories',
        {
          serviceId,
        },
      );
      return {
        button: {
          children: service.name,
        },
        link: {
          href,
        },
      };
    }) || [];

  const navItems: NavItem[] = serviceNavItems.concat([]);

  return {
    navItems,
  };
};
