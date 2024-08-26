'use client';

import React from 'react';
import {
  Button,
  Container,
  galaxy,
  ListBox,
  NavbarItem,
  ServiceName,
  useGetAllServiceSuspense,
  useGetService,
  useGetServiceSuspense,
  VStack,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { ListboxItem } from '@nextui-org/react';

interface UserServiceLayoutProps {
  children: React.ReactNode;
}

export type UserServicePageParams = {
  serviceId: string;
};

const UserServiceLayout = observer((props: UserServiceLayoutProps) => {
  const { serviceId } = useParams<UserServicePageParams>();
  console.log('serviceId', serviceId);
  // const getService = useGetServiceSuspense(serviceId);
  // const service = getService.data.data!;

  const items: NavbarItem[] = [
    {
      name: '그룹 관리',
      url: `/admin/main/services/:serviceId/groups`,
      onClick: () => {
        galaxy.router.push({
          url: '/admin/main/services/:serviceId/groups',
          params: { serviceId },
        });
      },
    },
  ];

  return (
    <Container className="h-full">
      <VStack className="items-start">
        {items?.map(item => (
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
