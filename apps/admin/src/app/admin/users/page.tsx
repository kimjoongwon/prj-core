'use client';

import { ButtonGroup, DataGrid, Pagination } from '@coc/ui';
import { SearchFilters } from './components';
import { usePage } from './hooks';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '@containers';
import { observer } from 'mobx-react-lite';

function Page() {
  const page = usePage();

  const {
    meta: { dataGrid, pagination, buttonGroup },
  } = page;
  console.log(page.state.table.selectedRowIds);
  return (
    <>
      <SearchFilterContainer>
        <SearchFilters />
      </SearchFilterContainer>
      <ButtonGroupContainer>
        <ButtonGroup
          leftButtons={buttonGroup.leftButtons}
          rightButtons={buttonGroup.rightButtons}
        />
      </ButtonGroupContainer>
      <DataGridContainer>
        <DataGrid
          selectionMode="multiple"
          data={dataGrid.data}
          columns={dataGrid.columns}
          onSelectionChange={dataGrid.onClickRow}
          onSortChange={dataGrid.onClickSorting}
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
