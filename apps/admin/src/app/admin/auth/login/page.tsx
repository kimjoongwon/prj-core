'use client';

import {
  Button,
  Container,
  LoginForm,
  Spacer,
  authStore,
  getCurrentUser,
  useGetLoginFormSchema,
  useLogin,
} from '@shared/frontend';
import { AxiosError } from 'axios';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { getErrorMessages } from '@shared/frontend/src/libs/ajv';
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
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    }
  };

  return (
    <Container className="max-w-screen-sm">
      {test.test}
      <Spacer y={10} />
      <LoginForm state={state} />
      <Spacer y={10} />
      <Button fullWidth onClick={onClickLogin}>
        로그인
      </Button>
    </Container>
  );
});

export default LoginPage;
