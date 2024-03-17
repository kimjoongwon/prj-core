'use client';

import { ButtonGroup, DataGrid, Pagination, Search } from '@coc/web';
import { usePage } from './hooks';
import { observer } from 'mobx-react-lite';

function Page() {
  const {
    handlers: { onClickRow, onClickSorting },
    queries: {
      usersQuery: { data },
    },
    meta: { actionColumns, leftButtons, rightButtons, userColumns },
    state,
  } = usePage();

  return (
    <>
      <Search state={state.search} queryState={state.query} path="email" />
      <ButtonGroup leftButtons={leftButtons} rightButtons={rightButtons} />
      <DataGrid
        selectionMode="multiple"
        data={data?.users.nodes || []}
        columns={[...userColumns, ...actionColumns]}
        onSelectionChange={onClickRow}
        onSortChange={onClickSorting}
      />
      <Pagination
        state={state.query}
        path="skip"
        totalCount={data?.users.pageInfo.totalCount || 0}
      />
    </>
  );
}

export default observer(Page);
