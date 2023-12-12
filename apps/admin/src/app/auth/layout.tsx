'use client';

import React, { useLayoutEffect } from 'react';
import { useAuth, useCoCRouter } from '@hooks';
import { LOGIN_PAGE_PATH } from '../shared/constants/auth';
import { observer } from 'mobx-react-lite';
import { isTokenExpired } from '@libs';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = (props: AuthLayoutProps) => {
  const { children } = props;
  const {
    state: { accessToken },
    handlers: { refreshToken },
  } = useAuth();

  const router = useCoCRouter();

  useLayoutEffect(() => {
    if (!accessToken) {
      // 로그인 페이지로 이동한다.
      return router.replace({ url: LOGIN_PAGE_PATH });
    }

    if (isTokenExpired(accessToken) || accessToken) {
      refreshToken();
    }
  }, []);

  return <>{children}</>;
};

export default observer(AuthLayout);
