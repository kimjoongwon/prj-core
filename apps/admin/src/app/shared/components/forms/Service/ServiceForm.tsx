'use client';

import { FormControl, Input, Select } from '@coc/web';
import { CreateServiceInput, UpdateServiceInput } from '@__generated__/graphql';
import { observer } from 'mobx-react-lite';
import { ZodSchema } from 'zod';

interface ServiceFormProps {
  state: CreateServiceInput | UpdateServiceInput;
  schema: ZodSchema;
}

export const ServiceForm = observer((props: ServiceFormProps) => {
  const { state, schema } = props;

  return (
    <FormControl timings={['onBlur', 'onChange']} schema={schema}>
      <Input state={state} path="name" label="이름" />
    </FormControl>
  );
});
