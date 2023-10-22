'use client';

import { observer } from 'mobx-react-lite';
import { FormControl, Input } from '@coc/ui';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@__generated__/graphql';
import { ZodSchema } from 'zod';

interface FormProps {
  formState: UpdateCategoryInput | CreateCategoryInput;
  schema: ZodSchema;
}

export const CategoryForm = observer((props: FormProps) => {
  const { formState, schema } = props;

  return (
    <FormControl schema={schema} timings={['onBlur']}>
      <Input label="서비스 분류명" state={formState} path="name" />
    </FormControl>
  );
});
