import { PageBuilder } from '@shared/types';

export const spacesPage: PageBuilder = {
  name: '공간',
  type: 'Page',
  dataGrid: {
    table: {
      query: {
        name: 'useGetSpacesByQuery',
        mapper: {
          serviceId: 'serviceId',
        },
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
};
