'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { DataGrid } from '@shared/frontend';
import { useProps } from './_hooks/useProps';

const ServicesPage = observer(() => {
  const { data = [], state, columns } = useProps();

  return <DataGrid data={data} columns={columns} />;
});

export default ServicesPage;
