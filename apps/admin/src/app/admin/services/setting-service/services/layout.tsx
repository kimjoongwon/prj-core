'use client';

import React from 'react';
import { Container } from '@shared/frontend';
import { observer } from 'mobx-react-lite';

interface UserServicesLayoutProps {
  children: React.ReactNode;
}

const UserServicesLayout = observer((props: UserServicesLayoutProps) => {
  return <Container>{props.children}</Container>;
});

export default UserServicesLayout;
