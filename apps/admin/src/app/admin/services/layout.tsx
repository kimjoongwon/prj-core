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
  useGetAllService,
} from '@shared/frontend';
import { uniqueId } from 'lodash-es';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';

interface ServicesLayoutProps {
  children: React.ReactNode;
}

const state = observable({
  currentService: {} as ServiceEntity,
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
        <VStack className="flex-grow-0 basis-60">
          <Listbox>
            {sidebarNavItems?.map(navItem => {
              return (
                <ListboxItem key={uniqueId()}>
                  {navItem.button.children}
                </ListboxItem>
              );
            })}
          </Listbox>
        </VStack>
        {children}
      </HStack>
    </Navbar>
  );
};

export default observer(ServicesLayout);

export const useMeta = () => {
  const { data: services } = useGetAllService();

  const topNavItems: NavItem[] =
    services?.map(service => {
      return {
        button: {
          children: service.name,
          onClick: () => (state.currentService = service),
        },
      };
    }) || [];

  const sidebarNavItems: Record<ServiceEntity['name'], NavItem[]> = {
    USER: [
      {
        button: {
          children: '유저 카테고리',
        },
      },
    ],
    SPACE: [
      {
        button: {
          children: '공간 카테고리',
        },
      },
    ],
  };

  return {
    topNavItems,
    sidebarNavItems: sidebarNavItems[state.currentService.name],
  };
};
