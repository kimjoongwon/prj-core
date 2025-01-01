import { ColumnBuilder } from '@shared/types';

export const getUserColumn = (): ColumnBuilder[] => {
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
  ];
};
