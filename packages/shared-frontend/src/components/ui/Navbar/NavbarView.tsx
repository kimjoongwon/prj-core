'use client';

import { observer } from 'mobx-react-lite';
import { HStack } from '../HStack';
import { Logo } from '../Logo';
import { VStack } from '../VStack';
import { NavbarItemProps, NavBarItem } from './Item';
import { useNavbar } from '.';

interface NavbarProps {
  navItems?: NavbarItemProps[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
  children: React.ReactNode;
}

export const NavbarView = observer((props: NavbarProps) => {
  const { rightContents, leftContents, children } = props;
  const {
    meta: { navBarItems, sidebarNavItems },
  } = useNavbar();

  return (
    <VStack className="w-full flex-grow-1 px-2">
      <HStack className="items-center flex-grow-0 basis-16">
        <HStack className="flex-1 items-center">
          <Logo variants="text" alt={'LOGO'} />
          {leftContents}
        </HStack>
        <HStack className="flex-1 gap-2 items-center justify-center">
          {navBarItems?.map(navbarItem => <NavBarItem {...navbarItem} />)}
        </HStack>
        <HStack className="flex-1 items-center gap-2 justify-end">
          {rightContents}
        </HStack>
      </HStack>
      <HStack className="h-full space-x-2">
        <VStack className="flex-grow-0 basis-44 border-1 p-2 h-full rounded-lg">
          {sidebarNavItems?.map(navItem => <NavBarItem {...navItem} />)}
        </VStack>
        <VStack className="w-full border-1 rounded-lg h-full">
          {children}
        </VStack>
      </HStack>
    </VStack>
  );
});
