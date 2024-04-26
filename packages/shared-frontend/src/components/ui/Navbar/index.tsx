'use client';

import { observer } from 'mobx-react-lite';
import { Container } from '../Container';
import { HStack } from '../HStack';
import { ButtonProps, Divider } from '@nextui-org/react';
import Button from '../Button';
import Link, { LinkProps } from 'next/link';

export interface NavItem {
  button: ButtonProps;
  link: LinkProps;
}

interface NavbarProps {
  children: React.ReactNode;
  navItems?: { button: ButtonProps; link: LinkProps }[];
}

export const Navbar = observer((props: NavbarProps) => {
  const { children, navItems = [] } = props;

  return (
    <Container>
      <HStack>
        <HStack className="justify-start items-center">
          <div>test</div>
        </HStack>
        <HStack>
          {navItems?.map(({ button, link }) => {
            return (
              <Link key={String(link.href)} {...link}>
                <Button {...button} />
              </Link>
            );
          })}
        </HStack>
        <HStack className="justify-end items-center">
          <div>test</div>
        </HStack>
      </HStack>
      <Divider />
      {children}
    </Container>
  );
});
