'use client';

import React from 'react';
import {
  ButtonGroup,
  Card,
  CardBody,
  DataGrid,
  Pagination,
  Search,
  Spacer,
} from '@coc/ui';
import { observer } from 'mobx-react-lite';
import { usePage } from './provider/hooks/usePage';

function Page() {
  const page = usePage();
  const users = page.queries.usersQuery.data.users;

  return (
    <>
      <Card>
        <CardBody>
          <Search
            state={page.state.search}
            queryState={page.state.query}
            path="email"
          />
        </CardBody>
      </Card>
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
        state={page.state.query}
        path="skip"
        totalCount={users.pageInfo?.totalCount || 0}
      />
    </>
  );
}

export default observer(Page);
