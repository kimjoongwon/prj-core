import { Navbar, NavbarContent, NavbarBrand, NavbarItem } from '@heroui/react';
import { HeaderProps } from '@shared/types';

export const Header = (props: HeaderProps) => {
  const { leftComponent, centerComponent, rightComponent } = props;

  return (
    <>
      <Navbar
        className="border-b border-divider bg-background/70 backdrop-blur-md"
        maxWidth="full"
        height="4rem"
        isBordered
      >
        {/* Desktop Layout */}
        <div className="flex w-full items-center">
          <NavbarBrand className="flex-1">{leftComponent}</NavbarBrand>

          <NavbarContent className="flex-1" justify="center">
            {centerComponent}
          </NavbarContent>

          <NavbarContent className="flex-1" justify="end">
            <NavbarItem>{rightComponent}</NavbarItem>
          </NavbarContent>
        </div>
      </Navbar>
    </>
  );
};

Header.displayName = 'Header';
