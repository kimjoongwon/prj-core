'use client';

import { useState } from 'react';
import { Logo } from '../Logo';
import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Divider,
} from '@heroui/react';
import { Avatar } from '../Avatar';
import { Text } from '../Text';
import { HeaderProps } from '@shared/types';

export const Header = (props: HeaderProps) => {
  const { content, centerComponent, drawerComponent, onMenuOpen } = props;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsDrawerOpen(true);
    onMenuOpen?.();
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

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
        <div className="flex xl:hidden w-full items-center">
          <NavbarContent>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={handleMenuOpen}
              className="text-default-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </NavbarContent>

          <NavbarBrand className="flex-1 justify-center">
            <Logo variants={'text'} />
          </NavbarBrand>

          <NavbarContent justify="end">
            <NavbarItem>
              <Avatar showInfo={false} />
            </NavbarItem>
          </NavbarContent>
        </div>
      </Navbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        hideCloseButton
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        placement="left"
        size="sm"
        className="xl:hidden"
        backdrop="blur"
        classNames={{
          base: 'data-[placement=left]:sm:m-2 data-[placement=left]:sm:rounded-medium',
          header: 'border-b border-divider',
          body: 'py-6',
        }}
      >
        <DrawerContent>
          <DrawerHeader className="pb-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </div>
                <Text variant="h6" className="text-foreground">
                  Navigation
                </Text>
              </div>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                radius="full"
                onPress={handleDrawerClose}
                className="text-default-500 hover:text-foreground"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
          </DrawerHeader>

          <Divider />

          <DrawerBody className="gap-6">
            {/* Mobile Navigation Content */}
            {drawerComponent && (
              <div className="space-y-2">{drawerComponent}</div>
            )}

            {content && (
              <>
                <Divider />
                <div className="space-y-3">
                  <Text
                    variant="subtitle2"
                    className="text-default-600 font-medium"
                  >
                    Additional Content
                  </Text>
                  <div className="pl-2">{content}</div>
                </div>
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

Header.displayName = 'Header';
