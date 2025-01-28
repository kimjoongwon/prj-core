import { RouteBuilder } from '@shared/types';

export const usersRoute: RouteBuilder = {
  name: '목록',
  pathname: 'users',
  page: {
    name: '목록',
    dataGrid: {
      table: {
        query: {
          name: `useGetUsersByQuery`,
        },
        columns: [
          {
            accessorKey: 'name',
            header: {
              name: '이름',
            },
          },
        ],
      },
    },
  },
};
