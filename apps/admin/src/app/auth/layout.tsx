'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = (props: AuthLayoutProps) => {
  return <>{props.children}</>;
};

export default observer(AuthLayout);
