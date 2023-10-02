'use client';

import React from 'react';
import { CoCPagination } from '@components';
import { ButtonGroup, DataGrid } from '@kimjwally/ui';
import { usePage } from './provider/hooks/usePage';
import { observer } from 'mobx-react-lite';

function Page() {
  const page = usePage();

  return (
    <div>
      <ButtonGroup
        leftButtons={page.meta.table.leftButtons}
        rightButtons={page.meta.table.rightButtons}
      />
      <DataGrid
        headers={page.table.getLeafHeaders()}
        rows={page.table.getRowModel().rows}
        selectionMode="single"
        onSelectionChange={page.meta.table.onSelectionChange}
        onSortChange={page.meta.table.onSortChange}
      />
      <CoCPagination
        state={page.state.table.pagination}
        fromTypename="PaginatedUser"
      />
    </div>
  );
}

export default observer(Page);
