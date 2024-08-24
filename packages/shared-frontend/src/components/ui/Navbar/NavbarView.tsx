'use client';

import { observer } from 'mobx-react-lite';
import { HStack } from '../HStack';
import { Logo } from '../Logo';
import { Button, ButtonProps } from '@nextui-org/react';
import { Paths } from '../../../constants/Paths';
import { v4 } from 'uuid';
import { children } from 'effect/Fiber';
import { VStack } from '../VStack';
import { Container } from '../Container';

export interface NavbarItem {
  url: Paths;
  name: string;
  onClick?: () => void;
}

interface NavbarProps {
  navbarItems: NavbarItem[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
  children: React.ReactNode;
}

export const NavbarView = observer((props: NavbarProps) => {
  const { rightContents, leftContents, navbarItems, children } = props;

  return (
    <VStack className="w-full">
      <HStack className="items-center flex-grow-0 basis-16">
        <HStack className="flex-1 items-center">
          <Logo variants="text" alt={'LOGO'} />
          {leftContents}
        </HStack>
        <HStack className="flex-1 gap-2 items-center justify-center">
          {navbarItems?.map(navbarItem => (
            <Button key={v4()} {...navbarItem}>
              {navbarItem.name}
            </Button>
          ))}
        </HStack>
        <HStack className="flex-1 items-center gap-2 justify-end">
          {rightContents}
        </HStack>
      </HStack>
      <Container>{children}</Container>
    </VStack>
  );
});
