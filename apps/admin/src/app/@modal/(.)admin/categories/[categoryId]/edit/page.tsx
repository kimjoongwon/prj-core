'use client';

import { CategoryForm } from '@components';
import { usePage } from '../../../../../admin/categories/[categoryId]/edit/hooks';

export default function Page() {
  const {
    form: { schema, state },
  } = usePage();
  return <CategoryForm formState={state} schema={schema} />;
}
