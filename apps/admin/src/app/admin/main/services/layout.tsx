'use client';

import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  galaxy,
  HStack,
  NavbarItem,
  ServiceName,
  Text,
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
    <HStack className="flex">
      <VStack className="space-x-2 flex-grow-0">
        <Card className="m-2 h-full">
          <CardHeader>
            <Text variant="h4">서비스명</Text>
          </CardHeader>
          <CardBody className="space-y-2">
            {navItems[serviceName || 'USER']?.map(item => (
              <Button variant="light" onClick={() => item.onClick?.()}>
                {item.name}
              </Button>
            ))}
          </CardBody>
        </Card>
      </VStack>
      <VStack className="w-full">
        <Card className="m-2 h-full p-2">{props.children}</Card>
      </VStack>
    </HStack>
  );
});

export default UserServiceLayout;
