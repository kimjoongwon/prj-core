import { createColumnHelper } from '@tanstack/react-table';
import { DateCell } from '../../../cells/Date/DateCell';
import { SessionDto } from '../../../../model/sessionDto';

export const useColumns = () => {
  const columnHelper = createColumnHelper<SessionDto>();

  const columns = [
    columnHelper.accessor('name', {
      header: '제목',
    }),
    columnHelper.accessor('createdAt', {
      header: '생성일',
      cell: DateCell,
    }),
  ];

  return columns;
};
