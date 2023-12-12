import { setItem } from '../../../libs/storage';
import { useMutations } from './useMutations';
import { useState } from './useState';
import { deleteCookie } from 'cookies-next';

export const useHandlers = ({
  state,
  mutations: {
    refreshTokenMutation: [
      refreshTokenMutate,
      { loading: isRefreshTokenLoading },
    ],
    loginMutation: [loginMutate, { loading: isLoginLoading }],
  },
}: {
  state: ReturnType<typeof useState>;
  mutations: ReturnType<typeof useMutations>;
}) => {
  const refreshToken = () => {
    refreshTokenMutate({
      onCompleted: data => {
        const { accessToken } = data.refreshToken;
        const { search } = window.location;

        const pathname = new URLSearchParams(search).get('redirectUrl');
        state.accessToken = accessToken;
        if (pathname) {
          window.location.href = pathname;
        }
      },
    });
  };

  const login = (onCompleted?: () => void) => {
    const {
      loginForm: { email, password },
    } = state;

    loginMutate({
      variables: {
        data: {
          email,
          password,
        },
      },
      onCompleted: data => {
        const {
          login: { accessToken, user },
        } = data;
        setItem('tenantId', user.tenants?.[0]?.id);
        state.accessToken = accessToken;
        state.user = data.login.user;
        if (onCompleted) {
          onCompleted();
        }
      },
    });
  };

  const logout = (onCompleted?: () => void) => {
    state.accessToken = undefined;
    state.user = null;
    deleteCookie('refreshToken');
    if (onCompleted) {
      onCompleted();
    }
  };

  return {
    isLoginLoading,
    isRefreshTokenLoading,
    login,
    refreshToken,
    logout,
  };
};
