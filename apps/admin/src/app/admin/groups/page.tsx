'use client';

import { observer } from 'mobx-react-lite';
import { ButtonGroup, DataGrid, Pagination, Search } from '@coc/web';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '@containers';
import { useGroupsPage } from './hooks';

function GroupsPage() {
  const groupsPage = useGroupsPage();

  const {
    handlers: { onClickRow, onClickSorting },
    queries: {
      groupsQuery: { data },
    },
    state,
    meta: { columns, leftButtons, rightButtons },
  } = groupsPage;

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
          data={data.groups.nodes}
          selectionMode="multiple"
          onSelectionChange={onClickRow}
          onSortChange={onClickSorting}
        />
      </DataGridContainer>
      <PaginationContainer>
        <Pagination
          state={state.query}
          path="skip"
          totalCount={data.groups.pageInfo.totalCount}
        />
      </PaginationContainer>
    </>
  );
}

export default observer(GroupsPage);
