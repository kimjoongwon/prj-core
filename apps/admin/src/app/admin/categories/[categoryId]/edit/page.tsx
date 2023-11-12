'use client';

import React from 'react';
import { CategoryForm } from '@components';
import { useCategoryEditPage } from './hooks';

export default function Page() {
  const {
    schemas: { categoryFormSchema },
    state,
  } = useCategoryEditPage();

  return <CategoryForm state={state.form} schema={categoryFormSchema} />;
}
