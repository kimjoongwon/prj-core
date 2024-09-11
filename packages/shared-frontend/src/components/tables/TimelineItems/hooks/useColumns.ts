import { createColumnHelper } from '@tanstack/react-table';
import { DateCell } from '../../../cells/Date/DateCell';
import { TimelineItemDto } from '../../../../model/timelineItemDto';

export const useColumns = () => {
  const columnHelper = createColumnHelper<TimelineItemDto>();

  const columns = [
    columnHelper.accessor('title', {
      header: '제목',
    }),
    columnHelper.accessor('description', {
      header: '설명',
    }),
    columnHelper.accessor('maxCapacity', {
      header: '최대 인원',
    }),
    columnHelper.accessor('minCapacity', {
      header: '최소 인원',
    }),
    columnHelper.accessor('address', {
      header: '장소',
    }),
    columnHelper.accessor('createdAt', {
      header: '생성일',
      cell: DateCell,
    }),
  ];

  return columns;
};
