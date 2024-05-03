'use client';

import { observer } from 'mobx-react-lite';
import { HStack } from '../HStack';
import { ButtonProps } from '@nextui-org/react';
import Button from '../Button';
import { LinkProps } from 'next/link';
import { Paths } from '../../../constants/Paths';
import { Logo } from '../Logo';
import { VStack } from '../VStack';
import { router } from '../../../stores';

export interface NavItem {
  url: Paths;
  text: string;
  children?: NavItem[];
  active: boolean;
  params?: object;
}

interface NavbarProps {
  navItems?: NavItem[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
}

export const Navbar = observer((props: NavbarProps) => {
  const { navItems = [], rightContents, leftContents } = props;

  const renderNavItem = (navItem: NavItem): React.ReactNode => {
    const { children, url, text, params, active } = navItem;

    if (children) {
      return children?.map(renderNavItem);
    }

    const onClickNavItem = () => {
      router.push({
        url,
        params,
      });
    };

    return (
      <Button
        variant="light"
        className="font-semibold"
        color={active ? 'primary' : 'default'}
        onClick={onClickNavItem}
      >
        {text}
      </Button>
    );
  };

  return (
    <VStack className="h-16 border-b-1 items-center justify-center">
      <HStack className="container px-4 justify-between">
        <HStack className="items-center">
          <Logo variants="text" alt={'LOGO'} />
          {leftContents}
        </HStack>
        <HStack className="gap-2 items-center justify-center">
          {navItems?.map(renderNavItem)}
        </HStack>
        <HStack className="items-center gap-2">{rightContents}</HStack>
      </HStack>
    </VStack>
  );
});
