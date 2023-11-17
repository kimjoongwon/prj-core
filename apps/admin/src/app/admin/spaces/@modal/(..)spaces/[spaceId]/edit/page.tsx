'use client';

import React from 'react';
import { SpaceForm } from '@components';
import { useSpaceEditPage } from '../../../../[spaceId]/edit/hooks';

export default function Page() {
  const { state, schemas } = useSpaceEditPage();
  console.log('???');
  return <SpaceForm state={state.form} schema={schemas.spaceFormSchema} />;
}
