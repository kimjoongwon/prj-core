'use client';

import {
  Button,
  Container,
  LoginForm,
  LoginFormDto,
  Spacer,
  VStack,
  useGetLoginForm,
  useGetLoginFormSchema,
  useLogin,
} from '@shared/frontend';
import { AxiosError } from 'axios';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { getErrorMessages } from '@shared/frontend/src/libs/ajv';

const defaultLoginFormObject = {
  email: '',
  password: '',
};

const LoginPage = observer(() => {
  const { data: loginForm } = useGetLoginForm();
  const { data: loginFormSchema } = useGetLoginFormSchema();
  const { mutateAsync: login } = useLogin();

  const state = useLocalObservable(
    () => loginForm?.data || defaultLoginFormObject,
  );

  const onClickLogin = async () => {
    console.log(loginFormSchema?.data!);
    const { errorMessages, valid } = getErrorMessages(
      state,
      loginFormSchema?.data!,
    );

    console.log('errorMessages', errorMessages);
    console.log('valid', valid);

    try {
      await login({ data: state });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    }
  };

  return (
    <Container className="max-w-screen-sm">
      <Spacer y={10} />
      <LoginForm state={state} schema={loginFormSchema?.data} />
      <Spacer y={10} />
      <Button fullWidth onClick={onClickLogin}>
        로그인
      </Button>
    </Container>
  );
});

export default LoginPage;
