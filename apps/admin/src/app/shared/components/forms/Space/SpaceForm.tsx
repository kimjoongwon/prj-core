'use client';

import { observer } from 'mobx-react-lite';
import { Input } from '@coc/ui';
import { WorkspaceForm as WorkspaceFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';

interface FormProps {
  state: WorkspaceFormType;
  schema: ZodSchema;
}

export const WorkspaceForm = observer((props: FormProps) => {
  const { state, schema } = props;

  return (
    <div className="space-y-4">
      <Input label="이름2" state={state} path="name" />
      <Input label="사업자 번호" state={state} path="businessNumber" />
      <Input label="주소" state={state} path="address" />
      <Input label="휴대폰" state={state} path="phone" />
    </div>
  );
});
