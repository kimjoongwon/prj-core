import { createColumnHelper } from '@tanstack/react-table';
import { ServiceDto } from '../../../../model/serviceDto';

export const useColumns = () => {
  const columnHelper = createColumnHelper<ServiceDto>();

  const columns = [
    columnHelper.accessor('name', {
      header: '이름',
    }),
    columnHelper.accessor('label', {
      header: '라벨',
    }),
  ];

  return columns;
};
