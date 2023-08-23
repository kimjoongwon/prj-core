import { Card, CardBody, InputProps, Spacer } from '@nextui-org/react';
import { Input } from '../../Input';
import { z } from 'zod';
import { ValidationControl } from '../../controls/Validation/ValidationControl';

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

  const validation = schema.safeParse(state);

  console.log('validation', validation);

  return (
    <Card>
      <CardBody>
        <ValidationControl timings={['onChange']} validator={undefined}>
          <Input
            state={state}
            path="email"
            placeholder="이메일을 입력해주세요."
            label="이메일"
            type="email"
            variant="bordered"
            validationState={
              !validation.success &&
              validation.error.format().email?._errors.join(',')
                ? 'invalid'
                : 'valid'
            }
            errorMessage={
              !validation.success &&
              validation.error.format().email?._errors.join(',')
            }
          />
        </ValidationControl>
        <Spacer />
        <Input
          state={state}
          path="password"
          placeholder="패스워드를 입력해주세요."
          label="패스워드"
          variant="bordered"
          validationState={validation.success ? 'valid' : 'invalid'}
          errorMessage={
            !validation.success &&
            validation.error.format().password?._errors.join(',')
          }
          type="password"
        />
      </CardBody>
    </Card>
  );
}
