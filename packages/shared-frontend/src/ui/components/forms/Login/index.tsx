'use client';

import { Card, CardBody, Spacer } from '@nextui-org/react';
import { FormControl } from '../../controls/Form/FormControl';
import Input from '../../Input';
import { LoginMutationBody } from '../../../../apis';
import { observer } from 'mobx-react-lite';

export interface LoginFormProps {
  state: LoginMutationBody;
  schema: any;
}

export const LoginForm = observer((props: LoginFormProps) => {
  const { state, schema } = props;

  return (
    <Card fullWidth>
      <CardBody>
        <FormControl timings={['onBlur']} schema={schema}>
          <Input
            state={state}
            path="email"
            placeholder="이메일을 입력해주세요."
            label="이메일"
            type="email"
          />
        </FormControl>
        <Spacer y={2} />
        <FormControl timings={['onBlur']} schema={schema}>
          <Input
            state={state}
            path="password"
            placeholder="패스워드를 입력해주세요."
            label="패스워드"
            type="password"
          />
        </FormControl>
      </CardBody>
    </Card>
  );
});
