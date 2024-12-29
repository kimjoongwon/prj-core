import { PageBuilder } from '@shared/types';

export const spacesPage: PageBuilder = {
  name: '공간',
  type: 'Page',
  query: {
    name: 'useGetSpacesByQuery',
    hasParams: true,
    params: {},
  },
  table: {
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
