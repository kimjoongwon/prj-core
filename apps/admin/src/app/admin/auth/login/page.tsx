'use client';

import {
  Button,
  Card,
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

const defaultLoginFormObject = {
  email: 'PROMISE@gmail.com',
  password: 'rkdmf12!@',
};

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
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    }
  };

  console.log({ ...authStore });

  return (
    <Container className="max-w-screen-sm">
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
