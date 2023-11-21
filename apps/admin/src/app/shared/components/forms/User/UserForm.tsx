'use client';

import { UserForm as _UserForm } from '@__generated__/graphql';
import { FormControl, FormGroupControl, Input, Select } from '@coc/ui';
import { observer } from 'mobx-react-lite';
import { ZodSchema } from 'zod';

interface UserFormProps<TSchema> {
  state: _UserForm;
  schema: TSchema;
}

export const UserForm = observer(
  <TSchema extends ZodSchema>(props: UserFormProps<TSchema>) => {
    const { schema, state } = props;

    return (
      <div className="space-y-4">
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
        <Input label="닉네임" state={state} path="nickname" />
        <Input label="이름" state={state} path="name" />
        <Input label="휴대폰" state={state} path="phone" />
        <Select
          label="역할"
          state={state}
          path="roleId"
          options={state.roleOptions}
          placeholder="역할을 선택해주세요."
        />
        <Select
          label="공간"
          state={state}
          path="spaceId"
          options={state.spaceOptions}
          placeholder="공간을 선택해주세요."
        />
      </div>
    );
  },
);
