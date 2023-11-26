'use client';

import React from 'react';
import { useSessionEditPage } from './hooks';
import { Calendar } from '../../../../shared/components/ui/Calendar';

export default function Page() {
  const {
    schemas: { sessionFormSchema },
    state,
  } = useSessionEditPage();

  return <Calendar />;
}
