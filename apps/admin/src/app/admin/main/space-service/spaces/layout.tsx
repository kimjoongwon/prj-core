import React from 'react';
import { Container } from '@shared/frontend';

interface SpaceLayoutProps {
  children: React.ReactNode;
}

const SpacesLayout = async (props: SpaceLayoutProps) => {
  const { children } = props;

  return children;
};

export default SpacesLayout;
