'use client';

import React from 'react';
import { useSessionEditPage } from './hooks';
import { observer } from 'mobx-react-lite';
import { SessionForm } from '@components';

function Page() {
  const {
    schemas: { sessionFormSchema },
    state,
  } = useSessionEditPage();

  return <SessionForm state={state.form} schema={sessionFormSchema} />;
}

export default observer(Page);
