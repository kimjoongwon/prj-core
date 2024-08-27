'use client';

import React from 'react';
import { Container } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { ServicePageParams } from '../page';

interface SpaceLayoutProps {
  children: React.ReactNode;
}

export type SpacesPageParams = ServicePageParams;

const SpaceLayout = observer((props: SpaceLayoutProps) => {
  return <Container className="h-full">{props.children}</Container>;
});

export default SpaceLayout;
