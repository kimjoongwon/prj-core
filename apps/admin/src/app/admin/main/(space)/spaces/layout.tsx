import React from 'react';
import { Container } from '@shared/frontend';

interface SpaceLayoutProps {
  children: React.ReactNode;
}

const SpacesLayout = async (props: SpaceLayoutProps) => {
  const { children } = props;

  return <Container className="h-full">{children}</Container>;
};

export default SpacesLayout;
