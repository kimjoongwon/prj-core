'use client';

import { observer } from 'mobx-react-lite';
import { Input, Select, VStack } from '../../ui';
import { CategoryDto } from '../../../model';
import { useProps } from './hooks/useProps';

export interface CategoryFormProps {
  state: Partial<CategoryDto>;
}

export const CategoryForm = observer((props: CategoryFormProps) => {
  const { childCategoryOptions, state } = useProps(props);

  return (
    <VStack className="space-y-2">
      <Input
        label="카테고리명"
        placeholder="카테고리명"
        state={state}
        path="name"
      />
      {childCategoryOptions.length > 0 && (
        <Select
          options={childCategoryOptions}
          state={state}
          path={'parentId'}
        />
      )}
    </VStack>
  );
});
