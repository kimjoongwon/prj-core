'use client';

import { observer } from 'mobx-react-lite';
import { FormControl, Input, Select } from '@coc/ui';
import { SessionForm as SessionFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';

interface FormProps {
  state: SessionFormType;
  schema: ZodSchema;
}

export const SessionForm = observer((props: FormProps) => {
  const { state, schema } = props;

  return (
    <div className="space-y-4">
    </div>
  );
});
