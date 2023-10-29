'use client';

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
} from '@nextui-org/react';
import { isEmpty } from 'lodash-es';
import { useState } from 'react';

interface NavItem {
  text: string;
  href: string;
  children?: NavItem[];
}

interface navMenuItem extends NavItem {}

interface NavbarProps {
  navItems: NavItem[];
  navMenuItems: navMenuItem[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
}

export function CoCNavbar(props: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { rightContents = <div>left</div>, leftContents = <div>right</div> } =
    props;
  const {
    navItems = [
      {
        text: '1',
        href: '1',
      },
      {
        text: '2',
        href: '2',
      },
    ],
    navMenuItems = [
      {
        text: '1',
        href: '1',
      },
      {
        text: '2',
        href: '2',
      },
    ],
  } = props;

  const renderNavItem = (item: NavItem) => {
    if (isEmpty(item.children)) {
      return (
        <NavbarItem key={item.text}>
          <Link href={item.href} color="foreground" size="lg">
            {item.text}
          </Link>
        </NavbarItem>
      );
    }
    return (
      <Dropdown>
        <NavbarItem key={item.text}>
          <DropdownTrigger>
            <Link href={item.href} color="foreground" size="lg">
              {item.text}
            </Link>
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu>
          <DropdownItem>Auto</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  };

  const renderNavMenuItem = (item: navMenuItem) => (
    <NavbarMenuItem key={item.text}>
      <Link className="w-full" size="lg" color="foreground" href={item.href}>
        {item.text}
      </Link>
    </NavbarMenuItem>
  );

  return (
    <NextUINavbar
      maxWidth="2xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          className="sm:hidden"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
        <NavbarBrand>
          <p className="font-bold text-large">프로미스</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navItems.map(renderNavItem)}
      </NavbarContent>

      <NavbarContent justify="end">{rightContents}</NavbarContent>

      <NavbarMenu>
        <div>{navMenuItems.map(renderNavMenuItem)}</div>
      </NavbarMenu>
    </NextUINavbar>
  );
}
