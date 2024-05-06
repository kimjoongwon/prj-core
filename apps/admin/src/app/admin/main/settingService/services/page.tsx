'use client';

import React from 'react';
import {
  useGetAllService,
  ServiceEntity,
  DataGrid,
  getServiceById,
  getGetServiceByIdQueryKey,
} from '@shared/frontend';
import { createColumnHelper } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { usePage } from './_hooks';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

const ServicesPage = observer(() => {
  const { data: services } = useGetAllService();
  const {
    meta: { rightButtons },
  } = usePage();

  const queryClient = useQueryClient();

  const columnHelper = createColumnHelper<ServiceEntity>();

  const colums = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: props => (
        <Link
          href={`/admin/main/settingService/services/${props.row.original.id}/edit`}
          onClick={() => {
            queryClient.prefetchQuery({
              queryKey: getGetServiceByIdQueryKey(props.row.original.id),
              queryFn: () => getServiceById(props.row.original.id),
            });
          }}
        >
          {props.getValue()}
        </Link>
      ),
    }),
  ];

  return (
    <DataGrid
      data={services || []}
      columns={colums}
      rightButtons={rightButtons}
    />
  );
});

export default ServicesPage;
