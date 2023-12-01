import { TimelineItem } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';

export const useTimelineItemColumns = () => {
  const columnHelper = createColumnHelper<TimelineItem>();

  const columns = [
    columnHelper.accessor('id', {
      header: '아이디',
    }),
  ];
  return columns;
};
