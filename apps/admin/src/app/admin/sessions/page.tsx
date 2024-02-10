'use client';

import { observer } from 'mobx-react-lite';
import { ButtonGroup, DataGrid, Pagination, Search } from '@coc/shared';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '@containers';
import { useSessionsPage } from './hooks';

function SessionsPage() {
  const sessionsPage = useSessionsPage();

  const {
    handlers: { onClickRow, onClickSorting },
    queries: {
      sessionsQuery: { data },
    },
    state,
    meta: { columns, leftButtons, rightButtons },
  } = sessionsPage;

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
          data={data.sessions.nodes}
          selectionMode="multiple"
          onSelectionChange={onClickRow}
          onSortChange={onClickSorting}
        />
      </DataGridContainer>
      <PaginationContainer>
        <Pagination
          state={state.query}
          path="skip"
          totalCount={data.sessions.pageInfo.totalCount}
        />
      </PaginationContainer>
    </>
  );
}

export default observer(SessionsPage);
