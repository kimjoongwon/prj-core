import { Category } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';

export const useServiceColumns = () => {
  const columnHelper = createColumnHelper<Category>();

  const columns = [
    columnHelper.accessor('id', {
      header: '아이디',
    }),
    columnHelper.accessor('name', {
      header: '이름',
    }),
  ];
  return columns;
};
