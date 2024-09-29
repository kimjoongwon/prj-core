'use client';

import {
  Button,
  Container,
  Copyright,
  LoginForm,
  Logo,
  Spacer,
  VStack,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { useHandlers, useState } from './hooks';

const LoginPage = observer(() => {
  const state = useState();
  const { onClickLogin, getDisabled, getLoading } = useHandlers({ state });

  return (
    <VStack className="w-full">
      <VStack className="w-full">
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
      </VStack>
      <Container className="h-[100px] justify-center items-center">
        <Copyright companyName="galaxy" />
      </Container>
    </VStack>
  );
});

export default LoginPage;
