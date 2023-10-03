'use client';

import { FormContainer, UserForm } from '@components';
import { usePage } from './provider/hooks/usePage';
import { Button, Spacer } from '@kimjwally/ui';

export default function UserEditPage() {
  const page = usePage();

  return (
    <FormContainer>
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
    </FormContainer>
  );
}
