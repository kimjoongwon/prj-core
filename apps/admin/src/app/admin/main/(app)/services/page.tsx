'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useProps } from './_hooks/useProps';
import { ServicesTable } from '@shared/frontend';

const ServicesPage = observer(() => {
  const { services, onClickRow } = useProps();

  return (
    <ServicesTable hideHeader services={services} selectionMode="single" />
  );
});

export default ServicesPage;
