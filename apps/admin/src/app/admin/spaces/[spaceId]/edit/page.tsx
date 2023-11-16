'use client';

import React from 'react';
import { SpaceForm } from '@components';
import { useSpaceEditPage } from './hooks';
import { Form } from '@coc/ui';

export default function Page() {
  const {
    schemas: { spaceFormSchema },
    state,
  } = useSpaceEditPage();

  return (
    <SpaceForm state={state.form} schema={spaceFormSchema} />
  );
}

