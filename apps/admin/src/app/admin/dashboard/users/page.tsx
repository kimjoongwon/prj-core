'use client';

import { CoCPagination } from '@components';
import { useCoCRouter } from '@hooks';
import { ButtonGroup, DataGrid } from '@kimjwally/ui';
import { usePage } from './providers/page/hooks/usePage';
import React from 'react';

export default function Page() {
  const router = useCoCRouter();
  const page = usePage();

  return (
    <React.Fragment>
      <ButtonGroup
        leftButtons={page.table.leftButtons}
        rightButtons={page.table.rightButtons}
      />
      <DataGrid
        selectionMode="single"
        headers={page.table.headers}
        rows={page.table.rows}
        onSortChange={sorting => {
          page.state.sortingValue = sorting.value;
          page.state.sortingKey = sorting.key;
        }}
        onSelectionChange={rowId => {
          router.push({
            url: '/admin/dashboard/users/:userId/edit',
            params: {
              userId: rowId,
            },
          });
        }}
      />
      <CoCPagination state={page.state} fromTypename="PaginatedUser" />
    </React.Fragment>
  );
}
