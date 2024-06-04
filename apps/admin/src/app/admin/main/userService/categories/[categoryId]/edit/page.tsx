'use client';

import { observer } from 'mobx-react-lite';
import { CategoryForm, FormLayout } from '@shared/frontend';

import { usePage } from './_hooks/usePage';

const CategoryDetailPage = observer(() => {
  const { state, meta } = usePage();

  if (!state.category) {
    return;
  }

  return (
    <FormLayout
      title="카테고리"
      leftButtons={meta.form.leftButtons}
      rightButtons={meta.form.rightButtons}
    >
      <CategoryForm type="create" state={state.category} />
    </FormLayout>
  );
});

export default CategoryDetailPage;
