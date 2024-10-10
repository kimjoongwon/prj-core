import React from 'react';
import { VStack } from '@shared/frontend';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = (props: AppLayoutProps) => {
  const { children } = props;

  return <VStack className="w-full items-center p-4">{children}</VStack>;
};

export default AppLayout;
