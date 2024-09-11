'use client';

import React from 'react';
import {
  Button,
  Container,
  galaxy,
  HStack,
  NavbarItem,
  ServiceName,
  useGetService,
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
  const getService = useGetService(serviceId);
  const serviceName = getService?.data?.data?.name;

  const navItems: Record<ServiceName, NavbarItem[]> = {
    RESERVATION: [
      {
        name: '예약 관리',
        url: '/admin/main/services/:serviceId/timelineItems',
        onClick: () => {
          galaxy.router.push({
            url: '/admin/main/services/:serviceId/timelineItems',
            params: { serviceId },
          });
        },
      },
      {
        name: '세션 관리',
        url: '/admin/main/services/:serviceId/sessions',
        onClick: () => {
          galaxy.router.push({
            url: '/admin/main/services/:serviceId/sessions',
            params: { serviceId },
          });
        },
      },
    ],
    USER: [
      {
        name: '템플릿 관리',
        url: '/admin/main/services/:serviceId/templates',
        onClick: () => {
          galaxy.router.push({
            url: '/admin/main/services/:serviceId/templates',
            params: { serviceId },
          });
        },
      },
    ],
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
        <HStack className="space-x-2">
          {navItems[serviceName || 'USER']?.map(item => (
            <Button variant="bordered" onClick={() => item.onClick?.()}>
              {item.name}
            </Button>
          ))}
        </HStack>
      </VStack>
      {props.children}
    </Container>
  );
});

export default UserServiceLayout;
