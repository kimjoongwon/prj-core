'use client';

import {
  ButtonGroup,
  Card,
  CardBody,
  DataGrid,
  Pagination,
  Search,
  SearchFilterContainer,
} from '@coc/ui';
import { usePage } from '../Provider/hooks/usePage';
import { observer } from 'mobx-react-lite';

export const Users = observer(() => {
  const page = usePage();
  const {
    meta: { dataGrid, pagination, buttonGroup },
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
