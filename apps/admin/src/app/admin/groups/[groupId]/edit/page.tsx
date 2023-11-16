'use client';

import React from 'react';
import { GroupForm } from '@components';
import { useGroupEditPage } from './hooks';

export default function Page() {
  const {
    schemas: { groupFormSchema },
    state,
  } = useGroupEditPage();

  return <GroupForm state={state.form} schema={groupFormSchema} />;
}
