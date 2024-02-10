'use client';

import { Card, CardBody, Input, Select } from '@coc/shared';
import { CategoryItemForm as TCategoryItemForm } from '@__generated__/graphql';
import { observer } from 'mobx-react-lite';

interface CategoryItemFormProps {
  state: TCategoryItemForm;
}

export const CategoryItemForm = observer((props: CategoryItemFormProps) => {
  const { state } = props;

  return (
    <Card fullWidth>
      <CardBody>
        <Input label='카테고리 항목명' state={state} path="name" />
      </CardBody>
    </Card>
  );
});
