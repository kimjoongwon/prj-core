'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useProps } from './_hooks/useProps';
import { ServicesTable } from '@shared/frontend';

const ServicesPage = observer(() => {
  const { services } = useProps();

  return <ServicesTable hideHeader services={services} />;
});

export default ServicesPage;
