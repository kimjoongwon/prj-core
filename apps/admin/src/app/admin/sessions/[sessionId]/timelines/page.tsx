'use client';

import { observer } from 'mobx-react-lite';
import { ButtonGroup, DataGrid, Pagination, Search } from '@coc/ui';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '@containers';
import { useTimelinesPage } from './hooks';

function TimelinesPage() {
  const timelinesPage = useTimelinesPage();

  const {
    handlers: { onClickRow, onClickSorting },
    queries: {
      timelinesQuery: { data },
    },
    state,
    meta: { columns, leftButtons, rightButtons },
  } = timelinesPage;

  return (
    <>
      <ButtonGroupContainer>
        <ButtonGroup leftButtons={leftButtons} rightButtons={rightButtons} />
      </ButtonGroupContainer>
      <DataGridContainer>
        <DataGrid
          columns={columns}
          data={data.timelines.nodes}
          selectionMode="multiple"
          onSelectionChange={onClickRow}
          onSortChange={onClickSorting}
        />
      </DataGridContainer>
      <PaginationContainer>
        <Pagination
          state={state.query}
          path="skip"
          totalCount={data.timelines.pageInfo.totalCount}
        />
      </PaginationContainer>
    </>
  );
}

export default observer(TimelinesPage);
