'use client';

import { observer } from 'mobx-react-lite';
import { ButtonGroup, DataGrid, Pagination } from '@coc/web';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
} from '@containers';
import { useTimelineItemsPage } from './hooks';

function TimelineItemsPage() {
  const timelineItemsPage = useTimelineItemsPage();

  const {
    handlers: { onClickRow, onClickSorting },
    queries: {
      timelineItemsQuery: { data },
    },
    state,
    meta: { columns, leftButtons, rightButtons },
  } = timelineItemsPage;

  return (
    <>
      <ButtonGroupContainer>
        <ButtonGroup leftButtons={leftButtons} rightButtons={rightButtons} />
      </ButtonGroupContainer>
      <DataGridContainer>
        <DataGrid
          columns={columns}
          data={data.timelineItems.nodes}
          selectionMode="multiple"
          onSelectionChange={onClickRow}
        />
      </DataGridContainer>
      <PaginationContainer>
        <Pagination
          state={state.query}
          path="skip"
          totalCount={data.timelineItems.pageInfo.totalCount}
        />
      </PaginationContainer>
    </>
  );
}

export default observer(TimelineItemsPage);
