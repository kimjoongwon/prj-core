'use client';

import React from 'react';
import { Container } from '@shared/frontend';
import { observer } from 'mobx-react-lite';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = observer((props: DashboardLayoutProps) => {
  return <Container>{props.children}</Container>;
});

export default DashboardLayout;
