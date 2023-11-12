'use client';

import { CategoryForm } from '@components';
import { useCategoryEditPage } from '../../../../../admin/categories/[categoryId]/edit/hooks';

export default function Page() {
  const {
    state,
    schemas: { categoryFormSchema },
  } = useCategoryEditPage();

  return <CategoryForm state={state.form} schema={categoryFormSchema} />;
}
