'use client';

import {
  Button,
  Container,
  LoginForm,
  Logo,
  Spacer,
  authStore,
  router,
  useFindGroupsByPageOptions,
  useGetAllSpace,
  useLogin,
} from '@shared/frontend';
import { AxiosError } from 'axios';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { observable } from 'mobx';

const defaultLoginFormObject = {
  email: 'PROMISE@gmail.com',
  password: 'rkdmf12!@',
};

export const test = observable({ test: '' });

const LoginPage = observer(() => {
  const { mutateAsync: login } = useLogin();
  const state = useLocalObservable(() => defaultLoginFormObject);

  const { data: spaces } = useGetAllSpace();

  const onClickLogin = async () => {
    try {
      const { accessToken, user } = await login({
        data: state,
      });

      authStore.accessToken = accessToken;
      const baseSpace = spaces?.find(space => space.name === '기본');
      const baseTenant = user?.tenants.find(
        tenant => tenant.spaceId === baseSpace?.id,
      );

      authStore.currentSpaceId = baseSpace?.id;
      authStore.currentTenant = baseTenant;

      router.push({
        url: '/admin/main',
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    }
  };

  return (
    <Container className="max-w-screen-sm">
      <Spacer y={10} />
      <Logo variants="text" alt="LOGO" />
      <Spacer y={10} />
      <LoginForm state={state} />
      <Spacer y={10} />
      <Button fullWidth size="lg" onClick={onClickLogin} color="primary">
        로그인
      </Button>
    </Container>
  );
});

export default LoginPage;
