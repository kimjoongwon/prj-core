---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/page.tsx
unless_exists: true
---
'use client';

import { observer } from 'mobx-react-lite';
import { ButtonGroup, DataGrid, Pagination, Search } from '@coc/web';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '@containers';
import { use<%= Name %>sPage } from './hooks';

function <%= Name %>sPage() {
  const <%= name %>sPage = use<%= Name %>sPage();

  const {
    handlers: { onClickRow, onClickSorting },
    queries: {
      <%= name %>sQuery: { data },
    },
    state,
    meta: { columns, leftButtons, rightButtons },
  } = <%= name %>sPage;

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
          data={data.<%= name %>s.nodes}
          selectionMode="multiple"
          onSelectionChange={onClickRow}
          onSortChange={onClickSorting}
        />
      </DataGridContainer>
      <PaginationContainer>
        <Pagination
          state={state.query}
          path="skip"
          totalCount={data.<%= name %>s.pageInfo.totalCount}
        />
      </PaginationContainer>
    </>
  );
}

export default observer(<%= Name %>sPage);
