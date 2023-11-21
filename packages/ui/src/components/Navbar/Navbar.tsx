'use client';

import {
  Button,
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
import { useState } from 'react';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import { FcAbout, FcManager } from 'react-icons/fc';
import { v4 } from 'uuid';
import NextLink from 'next/link';
import { observer } from 'mobx-react-lite';

export interface NavItem {
  text: string;
  href: string;
  children?: NavItem[];
  active: boolean;
}

interface navMenuItem extends NavItem {}

interface NavbarProps {
  navItems: NavItem[];
  navMenuItems: navMenuItem[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
}

export const CoCNavbar = observer((props: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { rightContents = <div>left</div>, leftContents = <div>right</div> } = props;
  const { navItems = [], navMenuItems = [] } = props;
  const renderNavItem = (item: NavItem) => {
    if (!item.children) {
      return (
        <NavbarItem key={v4()} isActive={item.active}>
          <Link href={item.href} color={item.active ? undefined : 'foreground'} size="lg" as={NextLink}>
            {item.text}
          </Link>
        </NavbarItem>
      );
    }

    return (
      <Dropdown key={v4()}>
        <NavbarItem>
          <DropdownTrigger>
            <Button
              size="lg"
              disableRipple
              className="text-large p-0 bg-transparent data-[hover=true]:bg-transparent"
              endContent={<FaChevronDown />}
            >
              {item.text}
            </Button>
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu
          aria-label="ACME features"
          className="w-[340px]"
          itemClasses={{
            base: 'gap-4',
          }}
        >
          {(item.children || []).map(child => (
            <DropdownItem
              key={v4()}
              className="w-[700px]"
              description="Overcome any challenge with a supporting team ready to respond."
              startContent={<FaUser />}
              href={child.href}
              as={NextLink}
            >
              {child.text}
            </DropdownItem>
          ))}
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
    <NextUINavbar maxWidth="2xl" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle className="sm:hidden" aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
        <NavbarBrand>
          <p className="font-bold text-large">프로미스</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navItems.map(renderNavItem)}
      </NavbarContent>

      <NavbarContent justify="end">{rightContents}</NavbarContent>

      <NavbarMenu>{navMenuItems.map(renderNavMenuItem)}</NavbarMenu>
    </NextUINavbar>
  );
});
