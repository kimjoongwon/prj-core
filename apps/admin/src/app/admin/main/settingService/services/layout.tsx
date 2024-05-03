'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { TableLayout } from '@shared/frontend';

interface UserServiceLayoutProps {
  children: React.ReactNode;
}

const ServicesLayout = observer((props: UserServiceLayoutProps) => {
  return <TableLayout>{props.children}</TableLayout>;
});

export default ServicesLayout;
