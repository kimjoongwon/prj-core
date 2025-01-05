import { ColumnBuilder } from '@shared/types';

export const getUserColumn = (columns?: ColumnBuilder[]): ColumnBuilder[] => {
  return [
    {
      accessorKey: 'name',
      header: {
        name: '이름',
      },
    },
    {
      accessorKey: 'phone',
      header: {
        name: '연락처',
      },
    },
    ...columns,
  ];
};
