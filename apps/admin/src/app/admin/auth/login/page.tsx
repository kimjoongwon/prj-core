'use client';

import {
  Button,
  Card,
  Container,
  LoginForm,
  Spacer,
  authStore,
  getCurrentUser,
  useGetCurrentUser,
  useGetLoginForm,
  useGetLoginFormSchema,
  useLogin,
} from '@shared/frontend';
import { AxiosError } from 'axios';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { getErrorMessages } from '@shared/frontend/src/libs/ajv';
import { useCoCRouter } from '@hooks';

const defaultLoginFormObject = {
  email: 'PROMISE@gmail.com',
  password: 'rkdmf12!@',
};

const LoginPage = observer(() => {
  const { data: loginForm } = useGetLoginForm();
  const { data: schema } = useGetLoginFormSchema();

  const { mutateAsync: login } = useLogin();
  const { push } = useCoCRouter();

  const state = useLocalObservable(() => defaultLoginFormObject);

  const onClickLogin = async () => {
    const { errorMessages, valid } = getErrorMessages(state, schema);

    try {
      const { accessToken, refreshToken } = await login({ data: state });
      authStore.accessToken = accessToken;

      const user = await getCurrentUser({
        accessToken,
        refreshToken,
      });

      authStore.user = user;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    }
  };

  console.log('authStore', { ...authStore });

  return (
    <Container className="max-w-screen-sm">
      <Card>
        <h1 className="text-3xl font-bold">
          {authStore.user?.tenants[0].id || '없음'}
        </h1>
      </Card>
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
