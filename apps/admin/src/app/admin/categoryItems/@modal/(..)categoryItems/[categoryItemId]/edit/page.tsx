'use client';

import React from 'react';
import { CategoryItemForm } from '@components';
import { useCategoryItemEditPage } from '../../../../[categoryItemId]/edit/hooks';

export default function Page() {
  const {
    form: { state },
  } = useCategoryItemEditPage();

  return <CategoryItemForm state={state} />;
}
