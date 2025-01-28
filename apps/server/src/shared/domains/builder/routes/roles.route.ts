import { RouteBuilder } from '@shared/types';

export const rolesRoute: RouteBuilder = {
  name: '목록',
  pathname: 'roles',
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
          name: `useGetRolesByQuery`,
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
