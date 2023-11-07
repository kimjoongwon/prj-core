'use client';

import { observer } from 'mobx-react-lite';
import { ButtonGroup, DataGrid, Pagination, Search } from '@coc/ui';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '@containers';
import { useWorkspacesPage } from './hooks';

function WorkspacesPage() {
  const workspacesPage = useWorkspacesPage();

  const {
    handlers: { onClickRow, onClickSorting },
    queries: {
      workspacesQuery: { data },
    },
    state,
    meta: { columns, leftButtons, rightButtons },
  } = workspacesPage;
  console.log('????');
  return (
    <>
      <SearchFilterContainer>
        <Search state={state.search} queryState={state.query} path="email" />
      </SearchFilterContainer>
      <ButtonGroupContainer>
        <ButtonGroup leftButtons={leftButtons} rightButtons={rightButtons} />
      </ButtonGroupContainer>
      <DataGridContainer>
        <DataGrid
          columns={columns}
          data={data.workspaces.nodes}
          selectionMode="multiple"
          onSelectionChange={onClickRow}
          onSortChange={onClickSorting}
        />
      </DataGridContainer>
      <PaginationContainer>
        <Pagination
          state={state.query}
          path="skip"
          totalCount={data.workspaces.pageInfo.totalCount}
        />
      </PaginationContainer>
    </>
  );
}

export default observer(WorkspacesPage);
