'use client';

import {
  Navbar,
  Container,
  useGetMemus,
  Button,
  HStack,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { contextStore } from '@stores';
import { Divider } from '@nextui-org/react';
import { useCoCRouter } from '../shared/hooks/common/useCoCRouter';

function Layout({ children }: { children: React.ReactNode }) {
  const { data: menuData } = useGetMemus();
  const { push } = useCoCRouter();
  const serviceMenus = menuData?.data;
  const menus = serviceMenus?.find(
    menu => menu.text === contextStore.service.name,
  )?.children;

  return (
    <Container>
      <Navbar
        navItems={serviceMenus}
        state={contextStore}
        rightContents={<div className="font-bold">접속유저정보영역</div>}
      />
      <HStack className="py-2">
        {menus?.map(menu => (
          <Button
            key={menu.pathname}
            className="font-bold"
            variant="bordered"
            onClick={() => push({ url: menu.pathname })}
          >
            {menu.text}
          </Button>
        ))}
      </HStack>
      <Divider />
      {children}
    </Container>
  );
}

export default observer(Layout);
