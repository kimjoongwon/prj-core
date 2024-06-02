'use client';

import {
  Button,
  Container,
  LoginForm,
  Logo,
  Spacer,
  myUniv,
} from '@shared/frontend';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { observable } from 'mobx';

const defaultLoginFormObject = {
  email: 'PROMISE@gmail.com',
  password: 'rkdmf12!@',
};

export const test = observable({ test: '' });

const LoginPage = observer(() => {
  const state = useLocalObservable(() => defaultLoginFormObject);

  function onClickLogin() {
    console.log(myUniv.auth);
    myUniv?.auth.login(state);
  }

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
