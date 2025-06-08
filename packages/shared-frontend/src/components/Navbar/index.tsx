'use client';

import { observer } from 'mobx-react-lite';
import { HStack } from '../HStack';
import { Logo } from '../Logo';
import { Button, Card } from '@heroui/react';
import { v4 } from 'uuid';

export interface NavbarMenuItemProps {
  url: string;
  name: string;
  onClick?: () => void;
}

interface NavbarProps {
  navbarItems: NavbarMenuItemProps[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
}

export const Navbar = observer((props: NavbarProps) => {
  const { rightContents, leftContents, navbarItems } = props;

  return (
    <Card className="flex-grow-1 m-2 px-2">
      <HStack className="items-center basis-14">
        <HStack className="flex-1 items-center">
          <Logo variants="text" />
          {leftContents}
        </HStack>
        <HStack className="flex-1 gap-2 items-center justify-center">
          {navbarItems?.map(navbarItem => (
            <Button variant="light" key={v4()} {...navbarItem}>
              {navbarItem.name}
            </Button>
          ))}
        </HStack>
        <HStack className="flex-1 items-center gap-2 justify-end">
          {rightContents}
        </HStack>
      </HStack>
    </Card>
  );
});
