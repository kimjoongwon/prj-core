'use client';

import {
  ButtonGroup,
  Card,
  CardBody,
  DataGrid,
  Pagination,
  Search,
} from '@coc/ui';
import { usePage } from '../Provider/hooks/usePage';
import { observer } from 'mobx-react-lite';

export const Users = observer(() => {
  const page = usePage();
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
        leftButtons={page.meta.leftButtons}
        rightButtons={page.meta.rightButtons}
      />
      <DataGrid
        selectionMode="multiple"
        headers={page.table.instance.getLeafHeaders()}
        rows={page.table.instance.getRowModel().rows}
        onSelectionChange={page.handlers.onClickRow}
        onSortChange={page.handlers.onClickSorting}
      />
      <Pagination
        state={page.state.query}
        path="skip"
        totalCount={page.table.totalCount}
      />
    </>
  );
});
