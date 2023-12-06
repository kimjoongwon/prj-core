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
import { v4 } from 'uuid';
import NextLink from 'next/link';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { action } from 'mobx';
import { FaArrowDown, FaArrowUp, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export interface NavItem {
  text: string;
  href: string;
  children?: NavItem[];
  active: boolean;
  icon?: React.ReactNode;
}

interface navMenuItem extends NavItem {}

interface NavbarProps {
  navItems: NavItem[];
  navMenuItems: navMenuItem[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
}

export const CoCNavbar = observer((props: NavbarProps) => {
  const state = useLocalObservable(() => ({
    isMenuOpen: true,
    selectedMenuItemText: '',
  }));

  const pathname = window.location.pathname;
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              variant="light"
              className="text-large p-0 bg-transparent data-[hover=true]:bg-transparent"
            >
              {item.text}
            </Button>
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu
          itemClasses={{
            base: 'gap-4',
          }}
        >
          {(item.children || []).map(child => (
            <DropdownItem variant="bordered" key={v4()} href={child.href} as={NextLink}>
              {child.text}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  };

  const renderNavMenuItem = (item: navMenuItem) => {
    if (item.children) {
      return (
        <NavbarMenuItem key={item.text}>
          <Button
            startContent={item.icon}
            variant="light"
            onClick={action(() => (state.selectedMenuItemText = item.text))}
            color=''
          >
            {item.text}test
          </Button>
        </NavbarMenuItem>
      );
    }

    return (
      <NavbarMenuItem key={item.text}>
        <Link className="w-full" size="lg" color="foreground" href={item.href} as={Button}>
          {item.text}
        </Link>
      </NavbarMenuItem>
    );
  };

  return (
    <NextUINavbar
      maxWidth="2xl"
      isMenuOpen={state.isMenuOpen}
      onMenuOpenChange={action(() => (state.isMenuOpen = !state.isMenuOpen))}
    >
      <NavbarContent>
        <NavbarMenuToggle className="sm:hidden" aria-label={state.isMenuOpen ? 'Close menu' : 'Open menu'} />
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
