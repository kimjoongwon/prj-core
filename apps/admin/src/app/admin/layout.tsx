'use client';

import { Container, Button, HStack, useGetAllService } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { navStore } from '@stores';
import { Divider } from '@nextui-org/react';
import { useCoCRouter } from '../shared/hooks/common/useCoCRouter';
import { NavItem } from '@components';

export default observer(({ children }: { children: React.ReactNode }) => {
  const { push } = useCoCRouter();
  // const { data } = useGetAllService();

  const navItems: NavItem[] = [
    {
      text: 'dashboard',
      pathname: '/admin/dashboard',
    },
    {
      text: '로그인',
      pathname: '/admin/auth/login',
    },
    {
      text: '유저 카테고리',
      pathname: '/admin/services/user/categories',
    },
  ];

  return (
    <Container>
      <HStack className="py-2">
        {navItems?.map(item => (
          <Button
            key={item.pathname}
            className="font-bold"
            variant="bordered"
            onClick={() => {
              navStore.push({
                url: item.pathname,
                params: {
                  serviceId: 'test',
                },
              });
            }}
          >
            {item.text}
          </Button>
        ))}
      </HStack>
      <Divider />
      {children}
    </Container>
  );
});
