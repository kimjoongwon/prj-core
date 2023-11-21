'use client';

import React from 'react';
import { UserForm } from '@components';
import { Button, Spacer } from '@coc/ui';
import { useUsersPage } from './hooks/usePage';

export default function Page() {
  const {
    schema,
    state: { formState },
    handlers: { onClickCancel, onClickSave },
  } = useUsersPage();

  return (
    <div>
      <UserForm schema={schema} state={formState} />
      <Spacer y={3} />
      <div className="flex justify-end">
        <div className="space-x-2">
          <Button color="danger" onClick={onClickCancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={onClickSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
