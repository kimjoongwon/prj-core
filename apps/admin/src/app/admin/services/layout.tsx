'use client';

import { Listbox, ListboxItem } from '@nextui-org/react';
import {
  Avatar,
  Button,
  HStack,
  NavItem,
  Navbar,
  ServiceEntity,
  VStack,
  authStore,
  router,
  useGetAllService,
} from '@shared/frontend';
import { uniqueId } from 'lodash-es';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';

interface ServicesLayoutProps {
  children: React.ReactNode;
}

const servicesPageState = observable({
  currentService: {} as ServiceEntity,
  sidebarNavItems: [] as NavItem[],
});

const ServicesLayout = (props: ServicesLayoutProps) => {
  const { children } = props;
  const { topNavItems, sidebarNavItems } = useMeta();

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
      navItems={topNavItems}
    >
      <HStack>
        {servicesPageState.currentService.name && (
          <VStack className="flex-grow-0 basis-60">
            <Listbox>
              {sidebarNavItems?.map(navItem => {
                return (
                  <ListboxItem
                    key={uniqueId()}
                    as={Link}
                    href={navItem.link?.href}
                  >
                    {navItem.button.children}
                  </ListboxItem>
                );
              })}
            </Listbox>
          </VStack>
        )}
        {children}
      </HStack>
    </Navbar>
  );
};

export default observer(ServicesLayout);

export const useMeta = () => {
  const { data: services } = useGetAllService();
  const setDefaultNavItem = () => {
    router.push({
      url: '/admin/services/:serviceId/categories',
      params: {
        serviceId: servicesPageState.currentService.id,
      },
    });
  };

  const topNavItems: NavItem[] =
    services?.map(service => {
      return {
        button: {
          children: service.name,
          onClick: () => {
            servicesPageState.currentService = service;
            setDefaultNavItem();
          },
        },
      };
    }) || [];

  const sidebarNavItems: Record<ServiceEntity['name'], NavItem[]> = {
    USER: [
      {
        button: {
          children: '유저 카테고리',
        },
        link: {
          href: router.getUrlWithParamsAndQueryString(
            '/admin/services/:serviceId/categories',
            {
              serviceId: servicesPageState.currentService.id,
            },
          ),
        },
      },
    ],
    SPACE: [
      {
        button: {
          children: '공간 카테고리',
        },
        link: {
          href: router.getUrlWithParamsAndQueryString(
            '/admin/services/:serviceId/categories',
            {
              serviceId: servicesPageState.currentService.id,
            },
          ),
        },
      },
    ],
  };

  return {
    topNavItems,
    sidebarNavItems: sidebarNavItems[servicesPageState.currentService.name],
  };
};
