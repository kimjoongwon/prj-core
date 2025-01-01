import { PageBuilder } from '@shared/types';

export const spacesPage: PageBuilder = {
  name: '공간',
  type: 'Page',
  table: {
    query: {
      name: 'useGetSpacesByQuery',
      hasParams: true,
      params: {},
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
};
