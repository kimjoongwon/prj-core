import React from 'react';
import { Container, VStack } from '@shared/frontend';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = (props: AuthLayoutProps) => {
  const { children } = props;
  return <VStack className="px-4">{children}</VStack>;
};

export default AuthLayout;
