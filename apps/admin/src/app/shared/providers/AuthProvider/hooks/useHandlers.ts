import { useCoCRouter } from '@hooks';
import { authStore } from '@stores';
import { useMutations } from './useMutations';
import { deleteCookie } from 'cookies-next';
import { storage } from '@libs';

export const useHandlers = ({
  mutations: {
    refreshTokenMutation: [
      refreshTokenMutate,
      { loading: isRefreshTokenLoading },
    ],
    loginMutation: [loginMutate, { loading: isLoginLoading }],
  },
}: {
  mutations: ReturnType<typeof useMutations>;
}) => {
  const router = useCoCRouter();

  const refreshToken = () => {
    refreshTokenMutate({
      onCompleted: data => {
        const { accessToken, user } = data.refreshToken;
        const { search } = window.location;

        const pathname = new URLSearchParams(search).get('redirectUrl');
        authStore.accessToken = accessToken;
        authStore.user = user;

        if (pathname) {
          router.replace(pathname as any);
        }
      },
    });
  };

  const login = (onCompleted?: () => void) => {
    const {
      loginForm: { email, password },
    } = authStore;

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

        storage.setItem('tenantId', user.tenants?.[0]?.id);
        authStore.accessToken = accessToken;
        authStore.user = data.login.user;
        if (onCompleted) {
          onCompleted();
        }
      },
    });
  };

  const logout = (onCompleted?: () => void) => {
    authStore.accessToken = undefined;
    authStore.user = null;
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
