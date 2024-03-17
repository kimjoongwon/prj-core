'use client';

import { ButtonGroup, DataGrid, Pagination } from '@coc/web';
import { useRolesPage } from './hooks';
import { observer } from 'mobx-react-lite';

function RolesPage() {
  const rolesPage = useRolesPage();

  const {
    handlers: { onClickRow, onClickSorting },
    queries: {
      rolesQuery: { data },
    },
    state,
    meta: { columns, leftButtons, rightButtons },
  } = rolesPage;

  return (
    <>
      <ButtonGroup leftButtons={leftButtons} rightButtons={rightButtons} />
      <DataGrid
        columns={columns}
        data={data?.roles?.nodes || []}
        selectionMode="multiple"
        onSelectionChange={onClickRow}
        onSortChange={onClickSorting}
      />
      <Pagination
        state={state.query}
        path="skip"
        totalCount={data?.roles.pageInfo.totalCount || 0}
      />
    </>
  );
}

export default observer(RolesPage);
