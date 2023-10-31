'use client';

import { observer } from 'mobx-react-lite';
import { FormControl, Input, Select } from '@coc/ui';
import { CategoryForm as CategoryFormType } from '@__generated__/graphql';
import { ZodSchema } from 'zod';
import { toJS } from 'mobx';

interface FormProps {
  formState: CategoryFormType;
  schema: ZodSchema;
}

export const CategoryForm = observer((props: FormProps) => {
  const { formState, schema } = props;
  console.log('formState', toJS(formState));
  return (
    <div className="space-y-4">
      <FormControl schema={schema} timings={['onBlur']}>
        <Input label="서비스 분류명" state={formState} path="name" />
      </FormControl>
      <Select
        label="카테고리 선택"
        placeholder="Select an Category"
        options={formState.categoryItemOptions}
        state={formState}
        path="categoryItemId"
      />
      <Select
        label="서비스 선택"
        placeholder="Select an Service"
        options={formState.serviceOptions}
        state={formState}
        path="serviceId"
      />
    </div>
  );
});
