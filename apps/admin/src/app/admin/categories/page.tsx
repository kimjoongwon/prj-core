'use client';

import { ButtonGroup, DataGrid, Pagination } from '@coc/web';
import { observer } from 'mobx-react-lite';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '@containers';
import { SearchFilters } from './_components';
import { usePage } from './_hooks';

const Page = () => {
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
};

export default observer(Page);
