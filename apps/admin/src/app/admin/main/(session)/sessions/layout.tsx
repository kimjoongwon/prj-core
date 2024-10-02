import React from 'react';
import { VStack } from '@shared/frontend';

type SessionsLayoutProps = {
  children: React.ReactNode;
};

const SessionsLayout = ({ children }: SessionsLayoutProps) => {
  return <VStack className="w-full">{children}</VStack>;
};

export default SessionsLayout;
