'use client';

import { Card, CardBody, Input, Select } from '@coc/ui';
import {
  CreateCategoryItemInput,
  UpdateCategoryItemInput,
} from '@__generated__/graphql';
import { observer } from 'mobx-react-lite';
interface CategoryItemFormProps {
  state: CreateCategoryItemInput | UpdateCategoryItemInput;
}

export const CategoryItemForm = observer((props: CategoryItemFormProps) => {
  const { state } = props;
  console.log('parent', state.parentId);
  return (
    <Card>
      <CardBody>
        <Input state={state} path="name" />
        <Select
          state={state}
          path="parentId"
          selectItems={[
            {
              key: '1',
              value: '1',
              title: '1',
            },
            {
              key: '2',
              value: '2',
              title: '2',
            },
          ]}
        />
      </CardBody>
    </Card>
  );
});
