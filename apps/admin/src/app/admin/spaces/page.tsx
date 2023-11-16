'use client';

import { observer } from 'mobx-react-lite';
import { ButtonGroup, DataGrid, Pagination, Search } from '@coc/ui';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '@containers';
import { useSpacesPage } from './hooks';

function SpacesPage() {
  const spacesPage = useSpacesPage();

  const {
    handlers: { onClickRow, onClickSorting },
    queries: {
      spacesQuery: { data },
    },
    state,
    meta: { columns, leftButtons, rightButtons },
  } = spacesPage;

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
          data={data.spaces.nodes}
          selectionMode="multiple"
          onSelectionChange={onClickRow}
          onSortChange={onClickSorting}
        />
      </DataGridContainer>
      <PaginationContainer>
        <Pagination
          state={state.query}
          path="skip"
          totalCount={data.spaces.pageInfo.totalCount}
        />
      </PaginationContainer>
    </>
  );
}

export default observer(SpacesPage);
