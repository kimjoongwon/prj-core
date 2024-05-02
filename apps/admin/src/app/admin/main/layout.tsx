'use client';

import { Listbox, ListboxItem } from '@nextui-org/react';
import {
  Avatar,
  Button,
  HStack,
  NavItem,
  Navbar,
  ServiceEntity,
  authStore,
  router,
  useGetAllService,
} from '@shared/frontend';
import { uniqueId } from 'lodash-es';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';

interface MainLayoutProps {
  children: React.ReactNode;
}

const mainPageState = observable({
  currentService: {} as ServiceEntity,
  sidebarNavItems: [] as NavItem[],
});

const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;
  const { topNavItems, sidebarNavItems } = useMeta();

  return (
    <>
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
      />
      <HStack className="container">
        {mainPageState.currentService.name && (
          <Listbox>
            {sidebarNavItems?.map(navItem => {
              return (
                <ListboxItem
                  variant="solid"
                  key={uniqueId()}
                  as={Link}
                  href={navItem.link?.href}
                >
                  {navItem.button.children}
                </ListboxItem>
              );
            })}
          </Listbox>
        )}
        {children}
      </HStack>
    </>
  );
};

export default observer(MainLayout);

export const useMeta = () => {
  const { data: services } = useGetAllService();
  const setDefaultNavItem = () => {
    router.push({
      url: '/admin/main/services/:serviceId/categories',
      params: {
        serviceId: mainPageState.currentService.id,
      },
    });
  };

  const topNavItems: NavItem[] =
    services?.map(service => {
      return {
        button: {
          children: service.name,
          onClick: () => {
            mainPageState.currentService = service;
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
            '/admin/main/services/:serviceId/categories',
            {
              serviceId: mainPageState.currentService.id,
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
            '/admin/main/services/:serviceId/categories',
            {
              serviceId: mainPageState.currentService.id,
            },
          ),
        },
      },
    ],
    SETTING: [
      {
        button: {
          children: '서비스 관리',
        },
        link: {
          href: '/admin/main/services',
        },
      },
    ],
  };

  return {
    topNavItems,
    sidebarNavItems: sidebarNavItems[mainPageState.currentService.name],
  };
};
