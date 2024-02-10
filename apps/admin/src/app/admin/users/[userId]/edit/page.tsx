'use client';

import React from 'react';
import { UserForm } from '@components';
import { Form } from '@coc/shared';
import { useUsersPage } from './hooks/usePage';
import { useParams } from 'next/navigation';
import { UserForm as UserFormType } from '@__generated__/graphql';

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
      <UserForm schema={schema} state={formState as any} />
    </Form>
  );
}
