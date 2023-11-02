'use client';

import { CategoryItemForm } from '@components';
import { usePage } from './_hooks';

export default function CategoryEditPage() {
  const {
    meta: { form },
  } = usePage();
  
  return <CategoryItemForm state={form.state} />;
}

