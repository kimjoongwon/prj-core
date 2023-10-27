'use client';

import { ButtonGroup, DataGrid, Pagination, Search } from '@coc/ui';
import { observer } from 'mobx-react-lite';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '@containers';
import { usePage } from './_hooks';

function Page() {
  const page = usePage();

  const {
    meta: {
      dataGrid: { data, columns, onClickRow, onClickSorting },
      pagination,
      buttonGroup,
    },
  } = page;

  return (
    <>
      <SearchFilterContainer>
        <Search
          state={page.state.search}
          queryState={page.state.query}
          path="email"
        />
      </SearchFilterContainer>
      <ButtonGroupContainer>
        <ButtonGroup
          leftButtons={buttonGroup.leftButtons}
          rightButtons={buttonGroup.rightButtons}
        />
      </ButtonGroupContainer>
      <DataGridContainer>
        <DataGrid
          columns={columns}
          data={data}
          selectionMode="multiple"
          onSelectionChange={onClickRow}
          onSortChange={onClickSorting}
        />
      </DataGridContainer>
      <PaginationContainer>
        <Pagination
          state={page.state.query}
          path="skip"
          totalCount={pagination.totalCount}
        />
      </PaginationContainer>
    </>
  );
}

export default observer(Page);
