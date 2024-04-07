'use client';

import {
  Button,
  Container,
  LoginForm,
  Spacer,
  useGetLoginForm,
  useGetLoginFormSchema,
  useLogin,
} from '@shared/frontend';
import { AxiosError } from 'axios';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { getErrorMessages } from '@shared/frontend/src/libs/ajv';
import { useCoCRouter } from '@hooks';
import { authStore } from '../../../shared/stores/authStore';

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
      window.localStorage.setItem('accessToken', accessToken);
      window.localStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    }

    alert('로그인 성공');
  };

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
