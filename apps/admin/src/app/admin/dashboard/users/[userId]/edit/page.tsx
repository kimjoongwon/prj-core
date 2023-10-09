'use client';

import { UserForm } from '@components';
import { usePage } from './provider/hooks/usePage';
import { Button, Spacer } from '@coc/ui';
import Link from 'next/link';
import { USERS_PAGE_PATH } from '../../../../../shared/constants/paths';
import React from 'react';

export default function UserEditPage() {
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
