'use client';

import { observer } from 'mobx-react-lite';
import { useProps } from './hooks/useProps';
import { DataGrid } from '../../ui';
import { TimelineItemDto } from '../../../model/timelineItemDto';

export interface TimelineItemsTableProps {
  timelineItems: TimelineItemDto[];
}

export const TimelineItemsTable = observer((props: TimelineItemsTableProps) => {
  const { timelineItems } = props;
  const { columns, leftButtons, state, rightButtons } = useProps();

  return (
    <DataGrid
      selectionMode="multiple"
      data={timelineItems}
      columns={columns}
      state={state}
      rightButtons={rightButtons}
      leftButtons={leftButtons}
    />
  );
});
