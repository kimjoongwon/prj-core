'use client';

import React from 'react';
import { ButtonGroup, DataGrid, Pagination } from '@coc/ui';
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
      <Pagination
        state={page.state.table.pagination}
        path="skip"
        totalCount={
          page.queries.workspacesQuery.data.workspaces.pageInfo?.totalCount ||
          10
        }
      />
    </div>
  );
}

export default observer(Page);
