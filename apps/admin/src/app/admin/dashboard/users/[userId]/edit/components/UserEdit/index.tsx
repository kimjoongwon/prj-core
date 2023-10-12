'use client';

import { UserForm } from '@components';
import { Button, Spacer } from '@coc/ui';
import React from 'react';
import { usePage } from '../Provider/hooks/usePage';

export function UserEdit() {
  const page = usePage();

  return (
    <React.Fragment>
      <UserForm schema={page.schema} state={page.state} />
      <Spacer y={3} />
      <div className="flex justify-end">
        <div className="space-x-2">
          <Button color="danger" onClick={page.meta.onClickCancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={page.meta.onClickSave}>
            Save
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}
