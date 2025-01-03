import { TableBuilder } from '@shared/types';

export const getGroupUsersTable = (): TableBuilder => {
  return {
    columns: [
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
    ],
  };
};
