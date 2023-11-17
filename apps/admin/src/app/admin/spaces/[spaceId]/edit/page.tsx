'use client';

import React from 'react';
import { useSpaceEditPage } from './hooks';
import { SpaceForm } from '@components';

export default function Page() {
  const {
    schemas: { spaceFormSchema },
    state,
  } = useSpaceEditPage();

  return <SpaceForm state={state.form} schema={spaceFormSchema} />;
}
