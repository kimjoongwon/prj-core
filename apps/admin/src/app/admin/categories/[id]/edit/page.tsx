'use client';

import React from 'react';
import { CategoryForm } from '@components';
import { usePage } from './_hooks';

export default function Page() {
  const page = usePage();
  const {
    form: { state, schema },
  } = page;

  return <CategoryForm formState={state} schema={schema} />;
}
