'use client';

import React from 'react';
import {
  Button,
  Container,
  galaxy,
  NavbarItem,
  ServiceName,
  useGetServiceSuspense,
  VStack,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';

interface UserServiceLayoutProps {
  children: React.ReactNode;
}

export type UserServicePageParams = {
  serviceId: string;
};

const UserServiceLayout = observer((props: UserServiceLayoutProps) => {
  const { serviceId } = useParams<UserServicePageParams>();
  const getService = useGetServiceSuspense(serviceId);
  const serviceName = getService.data.data?.name;

  const navItems: Record<ServiceName, NavbarItem[]> = {
    RESERVATION: [],
    USER: [],
    SPACE: [
      {
        name: '공간 관리',
        url: '/admin/main/services/:serviceId/spaces',
        onClick: () => {
          galaxy.router.push({
            url: '/admin/main/services/:serviceId/spaces',
            params: { serviceId },
          });
        },
      },
    ],
  };

  return (
    <Container className="h-full">
      <VStack className="items-start">
        {navItems[serviceName || 'USER']?.map(item => (
          <Button variant="light" onClick={() => item.onClick?.()}>
            {item.name}
          </Button>
        ))}
      </VStack>
      {props.children}
    </Container>
  );
});

export default UserServiceLayout;
