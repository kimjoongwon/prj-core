import React from 'react';
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  Button,
} from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { usePathname, useRouter } from 'next/navigation';
import { MenuDto } from '../../../model';

export interface NavItem {
  text: string;
  pathname?: string;
  icon?: string;
  children?: NavItem[];
}

interface NavbarProps {
  state: any;
  navItems?: MenuDto[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
}

export const Navbar = observer((props: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    state,
    rightContents = <div>left</div>,
    leftContents = <div>right</div>,
  } = props;

  const { navItems = [] } = props;

  const renderNavItem = (item: NavItem) => {
    const onClickMenuItem = () => {
      router.push(item.pathname!);
      state.service.name = item.text;
    };

    return (
      <Button
        key={item.pathname}
        color={pathname === item.pathname ? 'primary' : 'default'}
        className="font-bold text-lg"
        variant="light"
        onClick={onClickMenuItem}
      >
        {item.text}
      </Button>
    );
  };

  return (
    <NextUINavbar maxWidth="2xl" isBordered>
      <NavbarContent>
        <NavbarBrand>
          <Button
            onClick={() => router.replace('/admin/dashboard')}
            className="font-bold text-2xl"
            variant="light"
          >
            로고
          </Button>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="center">
        {navItems.map(renderNavItem)}
      </NavbarContent>
      <NavbarContent justify="end">{rightContents}</NavbarContent>
    </NextUINavbar>
  );
});
