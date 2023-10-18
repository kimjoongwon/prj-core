'use client';

import { ButtonGroup, Checkbox, DataGrid, Pagination } from '@coc/ui';
import { SearchFilters } from './_components';
import { usePage } from './_hooks';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '@containers';

export default function Page() {
  const page = usePage();

  const {
    meta: { dataGrid, pagination, buttonGroup },
  } = page;

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
          headers={dataGrid.instance.getLeafHeaders()}
          rows={dataGrid.instance.getRowModel().rows}
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
