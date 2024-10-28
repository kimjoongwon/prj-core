'use client';

import { observer } from 'mobx-react-lite';
import { CategoryForm, FormLayout } from '@shared/frontend';
import { usePage } from './_hooks/usePage';

const CategoryDetailPage = observer(() => {
  const { state, leftButtons, rightButtons } = usePage();

  return (
    <FormLayout
      title="카테고리"
      leftButtons={leftButtons}
      rightButtons={rightButtons}
    >
      <CategoryForm state={state.categoryForm} />
    </FormLayout>
  );
});

export default CategoryDetailPage;
