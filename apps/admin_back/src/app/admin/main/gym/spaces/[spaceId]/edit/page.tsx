'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { FormLayout, SpaceForm } from '@shared/frontend';
import { useProps } from './_hooks/useProps';

export type SpaceEditPageParams = {
  spaceId: string | 'null';
  serviceId: string | 'null';
};

const SpaceEditPage = observer(() => {
  const { leftButtons, rightButtons, state } = useProps();

  return (
    <FormLayout
      title="서비스"
      leftButtons={leftButtons}
      rightButtons={rightButtons}
    >
      <SpaceForm state={state.form} />
    </FormLayout>
  );
});

export default SpaceEditPage;
