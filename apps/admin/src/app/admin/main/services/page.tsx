'use client';

import { DataGrid, ServiceEntity, useGetAllService } from '@shared/frontend';
import { createColumnHelper } from '@tanstack/react-table';

const ServicesPage = () => {
  const { data: services } = useGetAllService();

  const columnHelper = createColumnHelper<ServiceEntity>();

  const colums = [columnHelper.accessor('name', { header: 'Name' })];

  return <DataGrid data={services || []} columns={colums} />;
};

export default ServicesPage;
