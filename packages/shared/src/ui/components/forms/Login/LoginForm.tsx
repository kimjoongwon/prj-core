'use client';

import { Card, CardBody, Spacer } from '@nextui-org/react';
import { FormControl } from '../../controls/Form/FormControl';
import { z } from 'nestjs-zod/z';
import Input from '../../Input';

export interface LoginFormProps {
  state: {
    email: string;
    password: string;
  };
}

export function LoginForm(props: LoginFormProps) {
  const {
    state = {
      email: '',
      password: '',
    },
  } = props;

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
  });

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
        <Spacer />
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
}
