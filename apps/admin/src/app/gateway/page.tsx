'use client';

import React, { useLayoutEffect } from 'react';
import { decodeToken } from 'react-jwt';
import { getItem, setItem } from '../shared/libs/storage';
import Jwt, { JwtPayload } from 'jsonwebtoken';
import { getCookie, setCookie } from 'cookies-next';
import { useMutation } from '@apollo/client';
import { REFRESH_TOKEN } from '../shared/gqls/mutations';
import dayjs from 'dayjs';
import { useCoCRouter } from '@hooks';
import { DASHBOARD_PAGE_PATH } from '../shared/constants/paths';

const AppGatewayPage = () => {
  const [refreshTokenMutate] = useMutation(REFRESH_TOKEN);
  const router = useCoCRouter();

  useLayoutEffect(() => {
    const accessToken = getItem('accessToken');
    const refreshToken = getCookie('refreshToken');

    if (accessToken) {
      const decodedToken = Jwt.decode(accessToken) as JwtPayload;
      const { exp } = decodedToken;
      if (exp) {
        const now = new Date().getTime();
        const expTime = new Date(exp * 1000).getTime();
        if (now > expTime) {
          // 토큰을 재발행한다.
          refreshTokenMutate({
            variables: {
              token: refreshToken,
            },
            onCompleted: data => {
              const { accessToken, refreshToken } = data.refreshToken;
              setItem('accessToken', accessToken);
              setCookie('refreshToken', refreshToken, {
                expires: dayjs().add(7, 'day').toDate(),
              });

              router.push({ url: DASHBOARD_PAGE_PATH });
            },
          });
        }
      }
    }

    if (refreshToken) {
      const decodedToken = Jwt.decode(refreshToken) as JwtPayload;
      const { exp } = decodedToken;
      if (exp) {
        const now = new Date().getTime();
        const expTime = new Date(exp * 1000).getTime();
        if (now > expTime) {
          // 리프레쉬 토큰이 만료되었을 경우 로그인을 다시 시도시킨다.
          window.location.href = 'auth/login';
        }
      }
    }
  });

  return <div>test</div>;
};

export default AppGatewayPage;
