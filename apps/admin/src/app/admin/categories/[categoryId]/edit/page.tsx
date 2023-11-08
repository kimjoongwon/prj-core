'use client';

import React from 'react';
import { CategoryForm } from '@components';
import { useCategoryEditPage } from './hooks';
import { Form } from '@coc/ui';

export default function Page() {
  const {
    handlers: { onClickCancel, onClickSave },
    schemas: { categoryFormSchema },
    state,
  } = useCategoryEditPage();

  return (
    <Form
      title="카테고리"
      state={state.form}
      schema={categoryFormSchema}
      onClickSave={onClickSave}
      onClickCancel={onClickCancel}
    >
      <CategoryForm state={state.form} schema={categoryFormSchema} />;
    </Form>
  );
}
