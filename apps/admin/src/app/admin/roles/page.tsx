'use client';

import { ButtonGroup, DataGrid, Pagination } from '@coc/ui';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
} from '@containers';
import { useRolesPage } from './hooks';

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
      <ButtonGroupContainer>
        <ButtonGroup leftButtons={leftButtons} rightButtons={rightButtons} />
      </ButtonGroupContainer>
      <DataGridContainer>
        <DataGrid
          columns={columns}
          data={data?.roles?.nodes || []}
          selectionMode="multiple"
          onSelectionChange={onClickRow}
          onSortChange={onClickSorting}
        />
      </DataGridContainer>
      <PaginationContainer>
        <Pagination
          state={state.query}
          path="skip"
          totalCount={data?.roles.pageInfo.totalCount || 0}
        />
      </PaginationContainer>
    </>
  );
}

export default RolesPage;
