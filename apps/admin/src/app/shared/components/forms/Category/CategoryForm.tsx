'use client';

import { observer } from 'mobx-react-lite';
import { FormControl, Input, Select } from '@coc/web';
import { CategoryForm as CategoryFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';

interface FormProps {
  state: CategoryFormType;
  schema: ZodSchema;
}

export const CategoryForm = observer((props: FormProps) => {
  const { state, schema } = props;

  return (
    <div className="space-y-4">
      <FormControl schema={schema} timings={['onBlur']}>
        <Input label="서비스 분류명" state={state} path="name" />
      </FormControl>
      <Select
        label="카테고리 선택"
        placeholder="Select an Category"
        options={state.itemOptions}
        state={state}
        path="itemId"
      />
      <Select
        label="서비스 선택"
        placeholder="Select an Service"
        options={state.serviceOptions}
        state={state}
        path="serviceId"
      />
    </div>
  );
});
