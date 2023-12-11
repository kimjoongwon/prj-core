'use client';

import React, { useLayoutEffect } from 'react';
import { getItem, setItem } from '../shared/libs/storage';
import Jwt, { JwtPayload } from 'jsonwebtoken';
import { setCookie } from 'cookies-next';
import { useMutation } from '@apollo/client';
import { REFRESH_TOKEN } from '../shared/gqls/mutations';
import dayjs from 'dayjs';
import { useCoCRouter } from '@hooks';
import { DASHBOARD_PAGE_PATH } from '../shared/constants/paths';
import { LOGIN_PAGE_PATH } from '../shared/constants/auth';

const AppGatewayPage = () => {
  const [refreshTokenMutate] = useMutation(REFRESH_TOKEN);
  const router = useCoCRouter();

  useLayoutEffect(() => {
    const accessToken = getItem('accessToken');
    // const refreshToken = getCookie('refreshToken');
    if (!accessToken) {
      // 로그인 페이지로 이동한다.
      return router.replace({ url: LOGIN_PAGE_PATH });
    }
    // console.log('refreshToken', refreshToken);
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
              token: accessToken,
            },
            onCompleted: data => {
              const { accessToken } = data.refreshToken;
              const { search } = window.location;
              const pathname = new URLSearchParams(search).get('redirectUrl');
              console.log('pathname', pathname);
              setItem('accessToken', accessToken);

              if (pathname) {
                window.location.href = pathname;
              }
            },
          });
        }
      }
    }

    // if (refreshToken) {
    //   const decodedToken = Jwt.decode(refreshToken) as JwtPayload;
    //   const { exp } = decodedToken;
    //   if (exp) {
    //     const now = new Date().getTime();
    //     const expTime = new Date(exp * 1000).getTime();
    //     if (now > expTime) {
    //       // 리프레쉬 토큰이 만료되었을 경우 로그인을 다시 시도시킨다.
    //       window.location.href = 'auth/login';
    //     }
    //   }
    // }
  }, []);

  return <div>test</div>;
};

export default AppGatewayPage;
