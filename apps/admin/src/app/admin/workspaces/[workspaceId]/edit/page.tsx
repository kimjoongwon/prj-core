'use client';

import React from 'react';
import { WorkspaceForm } from '@components';
import { useWorkspaceEditPage } from './hooks';

export default function Page() {
  const {
    schemas: { workspaceFormSchema },
    state,
  } = useWorkspaceEditPage();

  return <WorkspaceForm state={state.form} schema={workspaceFormSchema} />;
}
