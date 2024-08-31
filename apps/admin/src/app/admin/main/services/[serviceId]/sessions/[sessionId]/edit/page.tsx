'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { FormLayout, SessionForm } from '@shared/frontend';
import { useProps } from './_hooks/useProps';

const SessionEditPage = observer(() => {
  const { leftButtons, rightButtons, state } = useProps();

  return (
    <FormLayout
      title="타인라인아이템"
      leftButtons={leftButtons}
      rightButtons={rightButtons}
    >
      <SessionForm />
    </FormLayout>
  );
});

export default SessionEditPage;
