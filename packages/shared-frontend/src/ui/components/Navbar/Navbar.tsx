import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Button,
} from '@nextui-org/react';
import { v4 } from 'uuid';
import NextLink from 'next/link';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { action } from 'mobx';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
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

export const CoCNavbar = observer((props: NavbarProps) => {
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
      state.currentPath = item.pathname;
    };

    return (
      <Button variant="light" onClick={onClickMenuItem}>
        {item.text}
      </Button>
    );
  };

  return (
    <NextUINavbar
      maxWidth="2xl"
      isBordered
      isMenuOpen={state.isMenuOpen}
      onMenuOpenChange={action(
        () => (state.isMenuOpen = !state.isMenuOpen),
      )}
    >
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
