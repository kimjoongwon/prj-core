'use client';

import { observer } from 'mobx-react-lite';
import { FormControl, Select } from '@coc/shared';
import { RoleForm as RoleFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';

interface FormProps {
  state: RoleFormType;
  schema: ZodSchema;
}

export const RoleForm = observer((props: FormProps) => {
  const { state, schema } = props;
  return (
    <div className="space-y-4">
      <FormControl timings={['onChange']} schema={schema}>
        <Select options={state.options} state={state} path="name" />
      </FormControl>
    </div>
  );
});
