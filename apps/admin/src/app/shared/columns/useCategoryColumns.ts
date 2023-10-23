import { Category } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';

export const useCategoryColumns = () => {
  const columnHelper = createColumnHelper<Category>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'id',
    }),
    columnHelper.accessor('name', {
      header: '이름',
    }),
    columnHelper.accessor('deleted', {
      header: '삭제 여부',
      cell: cellProps => (cellProps.row.original.deleted ? '삭제' : '-'),
    }),
  ];
  return columns;
};
