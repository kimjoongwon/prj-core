'use client';

import React from 'react';
import { UserForm } from '@components';
import { Form } from '@coc/ui';
import { useUsersPage } from './hooks/usePage';
import { useParams } from 'next/navigation';

export default function Page() {
  const {
    schema,
    state: { formState },
    handlers: { onClickCancel, onClickSave },
  } = useUsersPage();
  const { userId } = useParams();

  return (
    <Form
      state={formState}
      schema={schema}
      title={userId != 'new' ? '유저 수정' : '유저 생성'}
      onClickSave={onClickSave}
      onClickCancel={onClickCancel}
    >
      <UserForm schema={schema} state={formState} />
    </Form>
  );
}
