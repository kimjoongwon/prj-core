import { Category } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const useCategoryColumns = () => {
  const columnHelper = createColumnHelper<Category>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'id',
    }),
    columnHelper.accessor('name', {
      header: '이름',
    }),
    columnHelper.accessor('deletedAt', {
      header: '삭제 여부',
      cell: cellProps =>
        cellProps.row.original.deletedAt
          ? dayjs(cellProps.row.original.deletedAt).format(
              'YYYY-MM-DD HH:mm:ss',
            )
          : '-',
    }),
  ];
  return columns;
};
