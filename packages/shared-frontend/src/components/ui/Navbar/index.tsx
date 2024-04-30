'use client';

import { observer } from 'mobx-react-lite';
import { HStack } from '../HStack';
import { ButtonProps, Divider, Spacer } from '@nextui-org/react';
import Button from '../Button';
import { LinkProps } from 'next/link';
import { Paths } from '../../../constants/Paths';
import { Logo } from '../Logo';
import { VStack } from '../VStack';

export interface NavItem {
  button: ButtonProps;
  link?: Omit<LinkProps, 'href'> & { href: Paths };
  children?: NavItem[];
}

interface NavbarProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
}

export const Navbar = observer((props: NavbarProps) => {
  const { children, navItems = [], rightContents, leftContents } = props;

  const renderNavItem = (navItem: NavItem): React.ReactNode => {
    const { button, children } = navItem;

    if (children) {
      return children?.map(renderNavItem);
    }

    return <Button variant="light" className="font-semibold" {...button} />;
  };

  return (
    <VStack>
      <HStack className="shadow-small px-2">
        <HStack className="items-center">
          <Logo variants="text" alt={'LOGO'} />
          {leftContents}
        </HStack>
        <HStack className="gap-2 items-center justify-center">
          {navItems?.map(renderNavItem)}
        </HStack>
        <HStack className="justify-end items-center gap-2">
          {rightContents}
        </HStack>
      </HStack>
      <Divider />
      {children}
    </VStack>
  );
});
