import React from 'react';
import { Container } from '@shared/frontend';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = (props: AuthLayoutProps) => {
  return <Container>{props.children}</Container>;
};

export default AuthLayout;
