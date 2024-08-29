import React from 'react';
import { Container } from '@shared/frontend';
import { ServicePageParams } from '../page';

interface SpaceLayoutProps {
  children: React.ReactNode;
}

export type SpacesPageParams = ServicePageParams;

const SpacesLayout = async (props: SpaceLayoutProps) => {
  const { children } = props;

  return <Container className="h-full">{children}</Container>;
};

export default SpacesLayout;
