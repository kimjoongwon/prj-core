'use client';

import React from 'react';
import {
  useGetAllService,
  ServiceEntity,
  DataGrid,
  getGetServiceQueryKey,
  getService,
  ServiceDto,
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

  const columnHelper = createColumnHelper<ServiceDto>();

  const colums = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: props => (
        <Link
          href={`/admin/main/settingService/services/${props.row.original.id}/edit`}
          onClick={() => {
            queryClient.prefetchQuery({
              queryKey: getGetServiceQueryKey(props.row.original.id),
              queryFn: () => getService(props.row.original.id),
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
      data={services?.data! || []}
      columns={colums}
      rightButtons={rightButtons}
      state={{
        selectedKeys: [],
      }}
    />
  );
});

export default ServicesPage;
