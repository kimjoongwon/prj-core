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

const defaultLoginFormObject = {
  email: 'PROMISE@gmail.com',
  password: 'rkdmf12!@',
};

const LoginPage = observer(() => {
  const { data: loginForm } = useGetLoginForm();
  const { data: loginFormSchema } = useGetLoginFormSchema();
  const { mutateAsync: login } = useLogin();
  const { push } = useCoCRouter();

  const state = useLocalObservable(() => defaultLoginFormObject);

  console.log('loginFormSchema', loginFormSchema);

  const onClickLogin = async () => {
    const { errorMessages, valid } = getErrorMessages(
      state,
      loginFormSchema?.data!,
    );

    try {
      await login({ data: state });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    }

    push({ url: '/admin/dashboard' });
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
