'use client';

import React from 'react';
import { Tabs, VStack } from '@shared/frontend';
import { useTabs } from './_hooks/useTabs';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;
  const tabs = useTabs();

  return (
    <VStack className="w-full items-center p-4">
      <Tabs items={tabs} />
      {children}
    </VStack>
  );
};

export default MainLayout;
