'use client';

import { observer } from 'mobx-react-lite';
import { CategoryForm, FormLayout } from '@shared/frontend';
import { usePage } from './_hooks/usePage';

const CategoryDetailPage = observer(() => {
  const { state, meta } = usePage();

  return (
    <FormLayout
      title="카테고리"
      leftButtons={meta.form.leftButtons}
      rightButtons={meta.form.rightButtons}
    >
      <CategoryForm state={state.categoryForm} />
    </FormLayout>
  );
});

export default CategoryDetailPage;
