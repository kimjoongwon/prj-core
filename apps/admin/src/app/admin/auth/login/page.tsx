'use client';

import {
  Button,
  Container,
  LoginForm,
  Logo,
  Spacer,
  galaxy,
} from '@shared/frontend';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { observable } from 'mobx';
import { Effect } from 'effect';

const defaultLoginFormObject = {
  email: 'galaxy@gmail.com',
  password: 'rkdmf123!@',
};

export const test = observable({ test: '' });

const LoginPage = observer(() => {
  const state = useLocalObservable(() => defaultLoginFormObject);

  async function onClickLogin() {
    await Effect.runPromise(galaxy?.auth.login(state));
  }

  return (
    <Container className="max-w-screen-sm">
      <Spacer y={10} />
      <Logo variants="text" alt="LOGO" />
      <Spacer y={10} />
      <LoginForm state={state} />
      <Spacer y={10} />
      <div>{galaxy.auth.status}</div>
      <Button
        disabled={status === 'pending'}
        fullWidth
        size="lg"
        onClick={onClickLogin}
        color="primary"
      >
        로그인
      </Button>
    </Container>
  );
});

export default LoginPage;
