import { DateCell, ServiceDto } from '@shared/frontend';
import { createColumnHelper } from '@tanstack/react-table';

export const useColumns = () => {
  const columnHelper = createColumnHelper<ServiceDto>();

  const columns = [
    columnHelper.accessor('name', {
      header: '이름',
    }),
    columnHelper.accessor('label', {
      header: '라벨',
    }),
    columnHelper.accessor('createdAt', {
      header: '생성일',
      cell: DateCell,
    }),
  ];

  return columns;
};
