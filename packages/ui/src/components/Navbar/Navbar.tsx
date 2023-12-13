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

export interface NavItem {
  text: string;
  href?: string;
  children?: NavItem[];
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

interface NavbarProps {
  navItems: NavItem[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
}

export const CoCNavbar = observer((props: NavbarProps) => {
  const pathname = usePathname();
  const state = useLocalObservable(() => ({
    isMenuOpen: false,
    selectedMenuItemText: '',
  }));

  const router = useRouter();

  const { rightContents = <div>left</div>, leftContents = <div>right</div> } =
    props;
  const { navItems = [] } = props;
  const renderNavItem = (item: NavItem) => {
    return (
      <Dropdown key={item.text}>
        <NavbarItem>
          <DropdownTrigger>
            <Button
              disableRipple
              className="capitalize text-large p-0 bg-transparent data-[hover=true]:bg-transparent text-gray-900"
              radius="sm"
              variant="light"
              color="danger"
            >
              {item.text}
            </Button>
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu
          selectedKeys={pathname}
          aria-label="ACME features"
          className="w-[340px]"
          itemClasses={{
            base: 'gap-4',
          }}
          variant="flat"
        >
          {(item.children || []).map(child => (
            <DropdownItem
              startContent={child.startContent}
              endContent={child.endContent}
              key={child.href}
              href={child.href}
              as={NextLink}
              className="font-bold text-4xl"
            >
              {child.text}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  };

  const renderNavMenuItem = (item: NavItem) => {
    if (item.children) {
      return (
        <React.Fragment key={v4()}>
          <NavbarMenuItem key={item.text}>{item.text}</NavbarMenuItem>
          {item.children?.map(item => {
            return (
              <Button
                key={v4()}
                fullWidth
                color={pathname === item.href ? 'primary' : 'default'}
                className="justify-between"
                startContent={item.startContent}
                endContent={item.endContent}
                onClick={() => {
                  router.push(item?.href || '');
                  state.isMenuOpen = false;
                }}
                variant="ghost"
              >
                {item.text}
              </Button>
            );
          })}
        </React.Fragment>
      );
    }

    return (
      <NavbarMenuItem key={v4()}>
        <Link
          className="w-full"
          size="lg"
          color="foreground"
          href={item.href}
          as={Button}
        >
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
        <NavbarMenuToggle
          className="sm:hidden"
          aria-label={state.isMenuOpen ? 'Close menu' : 'Open menu'}
        />
        <NavbarBrand>
          <Button
            onClick={() => router.replace('/admin/dashboard')}
            className="font-bold text-2xl"
            variant="light"
          >
            프로미스
          </Button>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navItems.map(renderNavItem)}
      </NavbarContent>

      <NavbarContent justify="end">{rightContents}</NavbarContent>

      <NavbarMenu>{navItems.map(renderNavMenuItem)}</NavbarMenu>
    </NextUINavbar>
  );
});
