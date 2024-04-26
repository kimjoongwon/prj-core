'use client';

import {
  Container,
  Button,
  HStack,
  useGetAllService,
  useGetAccessibleAllSpace,
  Select,
  authStore,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { navStore } from '@stores';
import { Divider } from '@nextui-org/react';
import { NavItem } from '@components';

const AdminLayout = observer(({ children }: { children: React.ReactNode }) => {
  const { data: services, isLoading } = useGetAllService();
  const { data: queryData } = useGetAccessibleAllSpace();
  const spaces = queryData?.data;

  const spaceOptions = spaces?.map(space => ({
    text: space.name,
    value: space.id,
  }));

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
      pathname: '/admin/services/:serviceId/categories',
      params: {
        serviceId: services?.find(service => service.name === 'USER')?.id,
      },
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
                params: item.params,
              });
            }}
          >
            {item.text}
          </Button>
        ))}
        <Select
          options={spaceOptions}
          state={authStore}
          path="currentSpaceId"
          value={spaceOptions?.[0]?.value}
        />
      </HStack>
      <Divider />
      <div>tenant: {authStore.currentTenant?.id}</div>
      <div>space: {authStore.currentSpaceId}</div>
      {children}
    </Container>
  );
});

export default AdminLayout;
