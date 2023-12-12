'use client';

import React, { useLayoutEffect } from 'react';
import { useAuth, useCoCRouter } from '@hooks';
import { LOGIN_PAGE_PATH } from '../shared/constants/auth';
import { isTokenExpired } from '@libs';
import { authStore } from '@stores';

const AuthPage = () => {
  const {
    handlers: { refreshToken },
  } = useAuth();

  const router = useCoCRouter();
  const { accessToken } = authStore;

  useLayoutEffect(() => {
    if (!accessToken) {
      // 로그인 페이지로 이동한다.
      return router.replace({ url: LOGIN_PAGE_PATH });
    }

    if (isTokenExpired(accessToken) || accessToken) {
      refreshToken();
    }
  }, []);

  return <></>;
};

export default AuthPage;
