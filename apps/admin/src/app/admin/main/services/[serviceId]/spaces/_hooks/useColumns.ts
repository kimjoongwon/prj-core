import { DateCell, SpaceDto } from '@shared/frontend';
import { createColumnHelper } from '@tanstack/react-table';

export const useColumns = () => {
  const columnHelper = createColumnHelper<SpaceDto>();

  const columns = [
    columnHelper.accessor('name', {
      header: '이름',
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
