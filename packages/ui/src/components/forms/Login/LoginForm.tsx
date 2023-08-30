import { Card, CardBody, Spacer } from '@nextui-org/react';
import { Input } from '../../Input';
import { FormControl } from '../../controls/Validation/ValidationControl';
import { z } from 'zod';

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
    profile: z.object({
      nickname: z.string().email(),
    }),
  });

  return (
    <Card>
      <CardBody>
        <FormControl timings={['onBlur']} schema={schema}>
          <Input
            state={state}
            path="email"
            placeholder="이메일을 입력해주세요."
            label="이메일"
            type="email"
            variant="bordered"
          />
        </FormControl>
        <Spacer />
        <FormControl timings={['onBlur']} schema={schema}>
          <Input
            state={state}
            path="password"
            placeholder="패스워드를 입력해주세요."
            label="패스워드"
            variant="bordered"
            type="password"
          />
        </FormControl>
      </CardBody>
    </Card>
  );
}
