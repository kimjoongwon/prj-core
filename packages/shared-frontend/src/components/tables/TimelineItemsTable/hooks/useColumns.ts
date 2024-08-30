import { createColumnHelper } from '@tanstack/react-table';
import { DateCell } from '../../../cells/Date/DateCell';
import { TimelineItemDto } from '../../../../model/timelineItemDto';

export const useColumns = () => {
  const columnHelper = createColumnHelper<TimelineItemDto>();

  const columns = [
    columnHelper.accessor('title', {
      header: '제목',
    }),
    columnHelper.accessor('createdAt', {
      header: '생성일',
      cell: DateCell,
    }),
    columnHelper.accessor('removedAt', {
      header: '삭제일',
      cell: DateCell,
    }),
  ];

  return columns;
};
