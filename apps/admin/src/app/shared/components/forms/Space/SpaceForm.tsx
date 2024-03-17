'use client';

import { observer } from 'mobx-react-lite';
import { Input } from '@coc/web';
import { SpaceForm as SpaceFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';

interface FormProps {
  state: SpaceFormType;
  schema: ZodSchema;
}

export const SpaceForm = observer((props: FormProps) => {
  const { state } = props;

  return (
    <div className="space-y-4">
      <Input label="이름" state={state} path="name" />
      <Input label="주소" state={state} path="address" />
      <Input label="휴대폰" state={state} path="phone" />
    </div>
  );
});
