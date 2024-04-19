'use client';

import { Card, CardBody, Spacer } from '@nextui-org/react';
import { LoginMutationBody } from '../../../../apis';
import { observer } from 'mobx-react-lite';
import Input from '../../Input';

export interface LoginFormProps {
  state: LoginMutationBody;
}

export const LoginForm = observer((props: LoginFormProps) => {
  const { state } = props;

  return (
    <Card fullWidth>
      <CardBody>
        <Input
          state={state}
          path="email"
          placeholder="이메일을 입력해주세요."
          label="이메일"
          type="email"
        />

        <Spacer y={2} />

        <Input
          state={state}
          path="password"
          placeholder="패스워드를 입력해주세요."
          label="패스워드"
          type="password"
        />
      </CardBody>
    </Card>
  );
});
