import { RouteBuilder } from '@shared/types';

export const actionsRoute: RouteBuilder = {
  name: '액션',
  pathname: 'actions',
  page: {
    name: '목록',
    dataGrid: {
      buttons: [
        {
          name: '생성',
          color: 'primary',
          navigator: {
            pathname: 'new/edit',
          },
        },
      ],
      table: {
        query: {
          name: 'useGetActionsByQuery',
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
