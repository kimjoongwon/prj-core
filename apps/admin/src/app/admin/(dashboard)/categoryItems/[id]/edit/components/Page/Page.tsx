'use client';

import React from 'react';
import { Button, Spacer } from '@coc/ui';
import { usePage } from '../PageProvider/hooks/usePage';
import { Form } from '../Form/Form';

export function Page() {
  const page = usePage();
  const {
    state,
    meta: { form, formActions },
  } = page;

  return (
    <React.Fragment>
      <Form schema={form.schema} state={state} />
      <Spacer y={3} />
      <div className="flex justify-end">
        <div className="space-x-2">
          <Button color="danger" onClick={formActions.onClickCancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={formActions.onClickSave}>
            Save
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}
