import { RouteBuilder } from '@shared/types';

export const sessionsRoute: RouteBuilder = {
  name: '세션',
  pathname: 'sessions',
  layout: {
    page: {
      name: '세션',
      dataGrid: {
        table: {
          query: {
            name: 'useGetSessionsByQuery',
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
  },
};
