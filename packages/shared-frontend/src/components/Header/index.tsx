'use client';

import { useState } from 'react';
import { Logo } from '../Logo';
import {
  Card,
  Chip,
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from '@heroui/react';
import { HStack } from '../HStack';
import { Avatar } from '../Avatar';
import { Text } from '../Text';
import { HeaderProps } from '@shared/types';

export const Header = (props: HeaderProps) => {
  const { content, children, navbarComponent, onMenuOpen } = props;
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
      <Card className="flex h-[62px] flex-col justify-center rounded-none overflow-visible">
        <HStack className="flex flex-1 items-center px-4">
          {/* Desktop Layout */}
          <div className="hidden xl:flex flex-1 items-center justify-between w-full">
            {/* Desktop: Logo */}
            <div className="flex-1">
              <Logo variants={'text'} />
            </div>

            {/* Desktop: Navigation Content */}
            <div className="flex-1 flex justify-center">
              {navbarComponent || content}
            </div>

            {/* Desktop: Right Side */}
            <div className="flex-1 flex justify-end items-center space-x-2">
              <Chip color="primary" size="sm">
                {process.env.NODE_ENV === 'development' ? '개발' : '운영'}
              </Chip>
              <Avatar showInfo={true} />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex xl:hidden items-center w-full relative">
            <div className="flex items-center w-12">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={handleMenuOpen}
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
            </div>

            {/* Mobile: Center - Logo (absolute positioning for true center) */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Logo variants={'text'} />
            </div>

            {/* Mobile: Right - Environment Chip + Avatar */}
            <div className="flex items-center space-x-2 ml-auto">
              <Chip color="primary" size="sm">
                {process.env.NODE_ENV === 'development' ? '개발' : '운영'}
              </Chip>
              <Avatar showInfo={false} />
            </div>
          </div>
        </HStack>
      </Card>

      {/* Mobile Navigation Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        placement="left"
        size="sm"
        className="xl:hidden"
        hideCloseButton
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Text variant="h6">Navigation</Text>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={handleDrawerClose}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
          </DrawerHeader>
          <DrawerBody className="flex flex-col gap-4">
            {/* Mobile Navigation Content */}
            <div className="space-y-4">
              {navbarComponent && (
                <div>
                  <Text variant="subtitle2" className="mb-2 text-gray-600">
                    Main Menu
                  </Text>
                  <div>{navbarComponent}</div>
                </div>
              )}
              {content && (
                <div>
                  <Text variant="subtitle2" className="mb-2 text-gray-600">
                    Additional Content
                  </Text>
                  <div>{content}</div>
                </div>
              )}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
