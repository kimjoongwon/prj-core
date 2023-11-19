'use client';

import React from 'react';
import { RoleForm } from '@components';
import { useRoleEditPage } from './hooks';

export default function Page() {
  const {
    schemas: { roleFormSchema },
    state,
  } = useRoleEditPage();

  return <RoleForm state={state.form} schema={roleFormSchema} />;
}
