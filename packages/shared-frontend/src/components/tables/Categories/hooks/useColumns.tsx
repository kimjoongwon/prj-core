import { createColumnHelper } from '@tanstack/react-table';
import { CategoryDto } from '../../../../model';

export const useColumns = () => {
  const columnHelper = createColumnHelper<CategoryDto>();

  const columns = [
    columnHelper.accessor('name', {
      header: '이름',
    }),
  ];

  return columns;
};
