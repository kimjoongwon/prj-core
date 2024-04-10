'use client';

import {
  Navbar,
  Container,
  useGetMemus,
  Button,
  HStack,
  User,
  authStore,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { contextStore } from '@stores';
import { Divider } from '@nextui-org/react';
import { useCoCRouter } from '../shared/hooks/common/useCoCRouter';

export default observer(({ children }: { children: React.ReactNode }) => {
  const { data: serviceMenus } = useGetMemus();
  const { push } = useCoCRouter();
  const menus = serviceMenus?.find(
    menu => menu.text === contextStore?.service.name,
  )?.children;

  return (
    <Container>
      <Navbar
        navItems={serviceMenus}
        state={contextStore}
        rightContents={<User />}
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
});
