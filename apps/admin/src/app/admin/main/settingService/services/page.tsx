'use client';

import { useGetAllService, ServiceEntity, DataGrid } from '@shared/frontend';
import { createColumnHelper } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { usePage } from './_hooks';

const ServicesPage = observer(() => {
  const { data: services } = useGetAllService();
  const {
    meta: { rightButtons },
  } = usePage();

  const columnHelper = createColumnHelper<ServiceEntity>();

  const colums = [columnHelper.accessor('name', { header: 'Name' })];

  return (
    <DataGrid
      data={services || []}
      columns={colums}
      rightButtons={rightButtons}
    />
  );
});

export default ServicesPage;
