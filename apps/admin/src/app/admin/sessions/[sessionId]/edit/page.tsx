'use client';

import React from 'react';
import { SessionForm } from '@components';
import { useSessionEditPage } from './hooks';

export default function Page() {
  const {
    schemas: { sessionFormSchema },
    state,
  } = useSessionEditPage();

  return <SessionForm />;
}
