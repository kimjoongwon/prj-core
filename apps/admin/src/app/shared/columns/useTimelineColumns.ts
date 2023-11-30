import { Timeline } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';

export const useTimelineColumns = () => {
  const columnHelper = createColumnHelper<Timeline>();

  const columns = [
    columnHelper.accessor('id', {
      header: '아이디',
    }),
  ];
  return columns;
};
