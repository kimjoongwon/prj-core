'use client';

import { observer } from 'mobx-react-lite';
import { FormControl, Input, Select } from '@coc/web';
import { GroupForm as GroupFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';

interface FormProps {
  state: GroupFormType;
  schema: ZodSchema;
}

export const GroupForm = observer((props: FormProps) => {
  const { state, schema } = props;

  return (
    <div className="space-y-4">
    </div>
  );
});
