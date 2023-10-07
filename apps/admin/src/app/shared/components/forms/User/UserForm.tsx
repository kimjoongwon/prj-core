'use client';

import { SignupInput } from '@__generated__/graphql';
import { FormControl, FormGroupControl, Input } from '@coc/ui';
import { observer } from 'mobx-react-lite';
import { ZodSchema } from 'zod';

interface UserFormProps<TSchema> {
  state: SignupInput;
  schema: TSchema;
}

export const UserForm = observer(
  <TSchema extends ZodSchema>(props: UserFormProps<TSchema>) => {
    const { schema, state } = props;

    return (
      <div className="space-y-2">
        <FormGroupControl direction="row">
          <FormControl timings={['onChange']} schema={schema}>
            <Input label="이메일" state={state} path="email" />
          </FormControl>
          <Input
            type="password"
            label="비밀번호"
            state={state}
            path="password"
          />
        </FormGroupControl>
        <Input label="닉네임" state={state} path="profile.nickname" />
        <Input label="휴대폰" state={state} path="profile.phone" />
      </div>
    );
  },
);
