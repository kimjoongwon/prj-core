'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import Script from 'next/script';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = (props: AuthLayoutProps) => {
  return <div className="flex justify-center">{props.children}</div>;
};

export default observer(AuthLayout);
