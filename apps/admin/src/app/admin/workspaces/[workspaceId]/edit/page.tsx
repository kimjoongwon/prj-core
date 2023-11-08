'use client';

import React from 'react';
import { WorkspaceForm } from '@components';
import { useWorkspaceEditPage } from './hooks';
import { Form } from '@coc/ui';

export default function Page() {
  const {
    handlers: { onClickCancel, onClickSave },
    schemas: { workspaceFormSchema },
    state,
  } = useWorkspaceEditPage();

  return (
    <Form
      title="카테고리"
      state={state.form}
      schema={workspaceFormSchema}
      onClickSave={onClickSave}
      onClickCancel={onClickCancel}
    >
      <WorkspaceForm state={state.form} schema={workspaceFormSchema} />;
    </Form>
  );
}

