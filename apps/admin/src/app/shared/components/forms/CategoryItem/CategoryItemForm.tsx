'use client';

import { Card, CardBody, Input } from '@coc/ui';
import { observer } from 'mobx-react-lite';
interface CategoryItemFormProps {
  state: {
    name: string;
  };
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
