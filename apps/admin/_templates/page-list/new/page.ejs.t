---
to: src/app/admin/dashboard/<%= name %>/page.tsx
unless_exists: true
---

'use client';

import React from 'react';
import { CoCPagination } from '@components';
import { ButtonGroup, DataGrid } from '@kimjwally/ui';
import { observer } from 'mobx-react-lite';
import { usePage } from './provider/hooks/usePage';

function Page() {
  const page = usePage();

  return (
    <div>
      <ButtonGroup
        leftButtons={page.meta.table.leftButtons}
        rightButtons={page.meta.table.rightButtons}
      />
      <DataGrid
        selectionMode="single"
        headers={page.table.getLeafHeaders()}
        rows={page.table.getRowModel().rows}
        onSelectionChange={page.meta.table.onClickRow}
        onSortChange={page.meta.table.onClickSorting}
      />
      <CoCPagination
        state={page.state.table.pagination}
        fromTypename="PaginatedUser"
      />
    </div>
  );
}

export default observer(Page);
