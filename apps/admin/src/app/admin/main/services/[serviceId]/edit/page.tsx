'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { FormLayout, ServiceForm } from '@shared/frontend';
import { useProps } from './_hooks/useProps';
import { ServicePageParams } from '../page';

export interface ServiceEditPageParams extends ServicePageParams {}

const ServiceEditPage = observer(() => {
  const { leftButtons, rightButtons, state } = useProps();

  return (
    <FormLayout
      title="서비스"
      leftButtons={leftButtons}
      rightButtons={rightButtons}
    >
      <ServiceForm state={state.form} />
    </FormLayout>
  );
});

export default ServiceEditPage;
