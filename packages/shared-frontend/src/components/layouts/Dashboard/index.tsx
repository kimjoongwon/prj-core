import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Button, Drawer, DrawerContent, DrawerHeader, DrawerBody } from '@heroui/react';
import { Text } from '../../Text';
import { DashboardLayoutProps } from '@shared/types';

export const DashboardLayout = observer((props: DashboardLayoutProps) => {
  const {
    headerComponent,
    leftSidebarComponent,
    rightSidebarComponent,
    children,
  } = props;

  // Mobile drawer state
  const drawerState = useLocalObservable(() => ({
    isOpen: false,
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
  }));

  const renderPlaceholder = (componentName: string) => (
    <div className="flex items-center justify-center h-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
      <Text variant="body1" className="text-gray-500 dark:text-gray-400">
        {componentName}
      </Text>
    </div>
  );

  // Create hamburger menu button for mobile
  const hamburgerButton = (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      className="xl:hidden"
      onPress={drawerState.open}
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
  );

  // Pass hamburger button to header component if it accepts children
  const header = headerComponent
    ? React.isValidElement(headerComponent)
      ? React.cloneElement(headerComponent as React.ReactElement<any>, {
          children: hamburgerButton,
        })
      : headerComponent
    : renderPlaceholder('HeaderComponent');

  const leftSidebar = leftSidebarComponent || renderPlaceholder('LeftSidebarComponent');
  const rightSidebar = rightSidebarComponent || renderPlaceholder('RightSidebarComponent');

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex-none border-b border-gray-200 dark:border-gray-700">
        {header}
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Hidden on tablet and mobile (iPad Mini and smaller) */}
        <div className="hidden xl:flex w-64 flex-col border-r border-gray-200 dark:border-gray-700 bg-background">
          <div className="h-full overflow-y-auto p-4">{leftSidebar}</div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>

        {/* Right Sidebar - Hidden on tablet and mobile (iPad Mini and smaller) */}
        <div className="hidden xl:flex w-64 flex-col border-l border-gray-200 dark:border-gray-700 bg-background">
          <div className="h-full overflow-y-auto p-4">{rightSidebar}</div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        isOpen={drawerState.isOpen}
        onClose={drawerState.close}
        placement="left"
        size="sm"
        className="xl:hidden"
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Text variant="h6">Navigation</Text>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={drawerState.close}
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
            {/* Navigation Content */}
            <div className="space-y-4">
              <div>
                <Text variant="subtitle2" className="mb-2 text-gray-600">
                  Main Menu
                </Text>
                <div>{leftSidebar}</div>
              </div>
              {rightSidebarComponent && (
                <div>
                  <Text variant="subtitle2" className="mb-2 text-gray-600">
                    Quick Access
                  </Text>
                  <div>{rightSidebar}</div>
                </div>
              )}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';
