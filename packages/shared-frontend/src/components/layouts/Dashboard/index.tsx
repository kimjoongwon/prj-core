import React from 'react';
import { Text } from '../../Text';
import { DashboardLayoutProps } from '@shared/types';

export const DashboardLayout = (props: DashboardLayoutProps) => {
  const {
    headerComponent,
    leftSidebarComponent,
    rightSidebarComponent,
    children,
  } = props;

  const renderPlaceholder = (componentName: string) => (
    <div className="flex items-center justify-center h-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
      <Text variant="body1" className="text-gray-500 dark:text-gray-400">
        {componentName}
      </Text>
    </div>
  );

  const header = headerComponent || renderPlaceholder('HeaderComponent');
  const leftSidebar =
    leftSidebarComponent || renderPlaceholder('LeftSidebarComponent');
  const rightSidebar =
    rightSidebarComponent || renderPlaceholder('RightSidebarComponent');

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
    </div>
  );
};

DashboardLayout.displayName = 'DashboardLayout';
