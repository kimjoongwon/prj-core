import { PageBuilder } from '@shared/types';

export const categoriesPage: PageBuilder = {
  type: 'Table',
  query: {
    name: 'useGetCategoriesByQuery',
    params: {
      serviceId: '',
      type: 'ROOT',
    },
  },
  table: {
    columns: [
      {
        accessorKey: 'name',
        header: {
          name: '이름',
          expandable: true,
        },
        cell: {
          expandable: true,
        },
      },
      {
        accessorKey: 'id',
        header: {
          name: 'ID',
        },
      },
      {
        id: 'action',
        header: {
          name: '액션',
        },
        cell: {
          buttons: [
            {
              name: '수정',
              navigator: {
                pathname: ':resourceId/edit',
              },
            },
            {
              name: '추가',
              navigator: {
                pathname: ':parentId/add',
              },
            },
          ],
        },
      },
    ],
  },
};
