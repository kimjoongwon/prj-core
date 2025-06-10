'use client';

import { Logo } from '../Logo';
import { Navbar, NavbarContent, NavbarBrand, NavbarItem } from '@heroui/react';
import { Avatar } from '../Avatar';
import { HeaderProps } from '@shared/types';

export const Header = (props: HeaderProps) => {
  const { content, centerComponent } = props;

  return (
    <>
      <Navbar
        className="border-b border-divider bg-background/70 backdrop-blur-md"
        maxWidth="full"
        height="4rem"
        isBordered
      >
        {/* Desktop Layout */}
        <div className="hidden xl:flex w-full items-center">
          <NavbarBrand className="flex-1">
            <Logo variants={'text'} />
          </NavbarBrand>

          <NavbarContent className="flex-1" justify="center">
            {centerComponent || content}
          </NavbarContent>

          <NavbarContent className="flex-1" justify="end">
            <NavbarItem>
              <Avatar showInfo={true} />
            </NavbarItem>
          </NavbarContent>
        </div>

        {/* Mobile Layout */}
        <div className="flex xl:hidden w-full items-center relative">
          <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
            <Logo variants={'text'} />
          </div>

          <NavbarContent className="ml-auto" justify="end">
            <NavbarItem>
              <Avatar showInfo={false} />
            </NavbarItem>
          </NavbarContent>
        </div>
      </Navbar>
    </>
  );
};

Header.displayName = 'Header';
