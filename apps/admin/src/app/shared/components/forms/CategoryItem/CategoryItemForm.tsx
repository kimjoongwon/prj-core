'use client';

import { Card, CardBody, Input, Select } from '@coc/ui';
import { CategoryItemForm as TCategoryItemForm } from '@__generated__/graphql';
import { observer } from 'mobx-react-lite';

interface CategoryItemFormProps {
  state: TCategoryItemForm;
}

export const CategoryItemForm = observer((props: CategoryItemFormProps) => {
  const { state } = props;

  return (
    <Card>
      <CardBody>
        <Input state={state} path="name" />
      </CardBody>
    </Card>
  );
});
