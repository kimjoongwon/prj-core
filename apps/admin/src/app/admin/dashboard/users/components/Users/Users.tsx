'use client';

import {
  ButtonGroup,
  DataGrid,
  Pagination,
  SearchFilterContainer,
} from '@coc/ui';
import { observer } from 'mobx-react-lite';
import { usePage } from '../PageProvider/hooks';
import { SearchFilters } from '../SearchFilters/SearchFilter';

export const Users = observer(() => {
  const page = usePage();

  const {
    meta: { dataGrid, pagination, buttonGroup },
  } = page;

  return (
    <>
      <SearchFilterContainer>
        <SearchFilters />
      </SearchFilterContainer>
      <ButtonGroup
        leftButtons={buttonGroup.leftButtons}
        rightButtons={buttonGroup.rightButtons}
      />
      <DataGrid
        selectionMode="multiple"
        headers={dataGrid.instance.getLeafHeaders()}
        rows={dataGrid.instance.getRowModel().rows}
        onSelectionChange={dataGrid.onClickRow}
        onSortChange={dataGrid.onClickSorting}
      />
      <Pagination
        state={page.state.query}
        path="skip"
        totalCount={pagination.totalCount}
      />
    </>
  );
});
