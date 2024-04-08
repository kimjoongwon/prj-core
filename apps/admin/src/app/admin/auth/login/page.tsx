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
  const { data: schema } = useGetLoginFormSchema();
  const { mutateAsync: login } = useLogin();
  const state = useLocalObservable(() => defaultLoginFormObject);

  const onClickLogin = async () => {
    const { errorMessages, valid } = getErrorMessages(state, schema);

    try {
      const { accessToken, refreshToken } = await login({ data: state });

      const user = await getCurrentUser({
        accessToken,
        refreshToken,
      });

      authStore.accessToken = accessToken;
      authStore.user = user;
      test.test = accessToken;
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
      <LoginForm state={state} schema={schema} />
      <Spacer y={10} />
      <Button fullWidth onClick={onClickLogin}>
        로그인
      </Button>
    </Container>
  );
});

export default LoginPage;
