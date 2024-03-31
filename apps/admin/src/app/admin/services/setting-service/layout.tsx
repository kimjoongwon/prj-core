'use client';

import React from 'react';
import { Container } from '@shared/frontend';
import { observer } from 'mobx-react-lite';

interface UserServiceLayoutProps {
  children: React.ReactNode;
}

const UserServiceLayout = observer(
  (props: UserServiceLayoutProps) => {
    return <Container>{props.children}</Container>;
  },
);

export default UserServiceLayout;
