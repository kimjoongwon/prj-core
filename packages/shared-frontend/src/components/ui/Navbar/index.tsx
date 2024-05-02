'use client';

import { observer } from 'mobx-react-lite';
import { HStack } from '../HStack';
import { ButtonProps, Divider, Spacer } from '@nextui-org/react';
import Button from '../Button';
import { LinkProps } from 'next/link';
import { Paths } from '../../../constants/Paths';
import { Logo } from '../Logo';
import { VStack } from '../VStack';
import { Container } from '../Container';

export interface NavItem {
  button: ButtonProps;
  link?: Omit<LinkProps, 'href'> & { href: Paths };
  children?: NavItem[];
}

interface NavbarProps {
  navItems?: NavItem[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
}

export const Navbar = observer((props: NavbarProps) => {
  const { navItems = [], rightContents, leftContents } = props;

  const renderNavItem = (navItem: NavItem): React.ReactNode => {
    const { button, children } = navItem;

    if (children) {
      return children?.map(renderNavItem);
    }

    return <Button variant="light" className="font-semibold" {...button} />;
  };

  return (
    <Container className="h-16 border-b-1">
      <HStack className="container">
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
    </Container>
  );
});
