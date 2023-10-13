'use client';

import {
  Link,
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react';
import { useState } from 'react';

interface NavItem {
  text: string;
  href: string;
}

interface navMenuItem extends NavItem {}

interface NavbarProps {
  navItems: NavItem[];
  navMenuItems: navMenuItem[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
}

export function Navbar(props: NavbarProps) {
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

  const renderNavItem = (item: NavItem) => (
    <NavbarItem key={item.text}>
      <Link href={item.href} color="foreground" size="lg">
        {item.text}
      </Link>
    </NavbarItem>
  );

  const renderNavMenuItem = (item: navMenuItem) => (
    <NavbarMenuItem key={item.text}>
      <Link className="w-full" size="lg" color="foreground" href={item.href}>
        {item.text}
      </Link>
    </NavbarMenuItem>
  );

  return (
    <>
      <NextUINavbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          />
        </NavbarContent>

        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>
            LOGO
            <p className="font-bold text-inherit">BRAND</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {navItems.map(renderNavItem)}
        </NavbarContent>

        <NavbarContent justify="end">{rightContents}</NavbarContent>

        <NavbarMenu>
          <NavbarMenuItem>{navMenuItems.map(renderNavMenuItem)}</NavbarMenuItem>
        </NavbarMenu>
      </NextUINavbar>
    </>
  );
}
