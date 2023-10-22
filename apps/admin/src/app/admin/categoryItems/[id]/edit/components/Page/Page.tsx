'use client';

import React from 'react';
import { usePage } from '../PageProvider/hooks/usePage';
import { CategoryForm } from '@components';

export function Page() {
  const page = usePage();
  const { state } = page;

  return <CategoryForm formState={state} />;
}
