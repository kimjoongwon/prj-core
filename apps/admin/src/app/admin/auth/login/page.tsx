'use client';

import { Button, Container, LoginForm, Logo, Spacer } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { useHandlers, useState } from './hooks';

const LoginPage = observer(() => {
  const state = useState();
  const { onClickLogin, getDisabled, getLoading } = useHandlers({ state });

  return (
    <Container className="max-w-screen-sm">
      <Spacer y={10} />

      <Logo variants="text" alt="LOGO" />

      <Spacer y={10} />

      <LoginForm state={state} />

      <Spacer y={10} />

      <Button
        getDisabled={getDisabled}
        getLoading={getLoading}
        color="primary"
        fullWidth
        size="lg"
        onClick={onClickLogin}
      >
        로그인
      </Button>
    </Container>
  );
});

export default LoginPage;
