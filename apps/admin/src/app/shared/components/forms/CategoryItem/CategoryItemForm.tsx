'use client';

import { Card, CardBody, Input } from '@coc/ui';
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

  return (
    <Card>
      <CardBody>
        <Input state={state} path="name" />
      </CardBody>
    </Card>
  );
});
