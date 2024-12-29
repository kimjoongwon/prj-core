import { PageBuilder } from '@shared/types';

export const usersPage: PageBuilder = {
  name: '이용자',
  type: 'Page',
  query: {
    name: 'useGetUsersByQuery',
    hasParams: true,
  },
  table: {
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
      {
        accessorKey: 'space.name',
        header: {
          name: '소속명',
        },
      },
    ],
  },
};
