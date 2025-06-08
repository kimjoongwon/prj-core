'use client';

import { observer } from 'mobx-react-lite';
import { HStack } from '../HStack';
import { Button } from '@heroui/react';
import { v4 } from 'uuid';

export interface NavbarMenuItemProps {
  url: string;
  name: string;
  onClick?: () => void;
}

interface NavbarProps {
  navbarItems: NavbarMenuItemProps[];
}

export const Navbar = observer((props: NavbarProps) => {
  const { navbarItems } = props;

  return (
    <HStack className="flex-1 gap-2 items-center justify-center">
      {navbarItems?.map(navbarItem => (
        <Button variant="light" key={v4()} {...navbarItem}>
          {navbarItem.name}
        </Button>
      ))}
    </HStack>
  );
});
