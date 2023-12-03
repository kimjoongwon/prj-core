import { TimelineItem } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';

export const useTimelineItemColumns = () => {
  const columnHelper = createColumnHelper<TimelineItem>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
    }),
    columnHelper.accessor('title', {
      header: '타이틀',
    }),
  ];
  return columns;
};
