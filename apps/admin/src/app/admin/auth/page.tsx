'use client';

import React, { useLayoutEffect } from 'react';
import { useAuth } from '@hooks';

const AuthPage = () => {
  const {
    handlers: { refreshToken },
  } = useAuth();

  useLayoutEffect(() => {
    refreshToken();
  }, []);

  return <></>;
};

export default AuthPage;
