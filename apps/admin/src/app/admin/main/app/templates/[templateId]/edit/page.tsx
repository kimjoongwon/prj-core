'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { FormLayout, TemplateForm } from '@shared/frontend';
import { useProps } from './_hooks/useProps';

const TemplateEditPage = observer(() => {
  const { leftButtons, rightButtons, state } = useProps();

  return (
    <FormLayout
      title="템플레이트"
      leftButtons={leftButtons}
      rightButtons={rightButtons}
    >
      <TemplateForm state={state.form} />
    </FormLayout>
  );
});

export default TemplateEditPage;
