'use client';

import React from 'react';
import { UserForm } from '@components';
import { Form } from '@coc/ui';
import { useUsersPage } from './hooks/usePage';

export default function Page() {
  const {
    schema,
    state: { formState },
    handlers: { onClickCancel, onClickSave },
  } = useUsersPage();

  return (
    <Form
      state={formState}
      schema={schema}
      title={'유저 편집'}
      onClickSave={onClickSave}
      onClickCancel={onClickCancel}
    >
      <UserForm schema={schema} state={formState} />
    </Form>
  );
}
