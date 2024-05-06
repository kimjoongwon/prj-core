'use client';

import {
  Button,
  Container,
  LoginForm,
  Logo,
  Spacer,
  authStore,
  router,
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

  const onClickLogin = async () => {
    try {
      const { data: tokenDto } = await login({
        data: state,
      });

      authStore.accessToken = tokenDto?.accessToken;
      authStore.user = tokenDto?.user;

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
