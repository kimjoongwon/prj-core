import { PageBuilder } from '@shared/types';

export const categoriesPage: PageBuilder = {
  type: 'Page',
  dataGrid: {
    table: {
      query: {
        name: 'useGetCategoriesByQuery',
        params: {
          serviceId: '',
          type: 'ROOT',
        },
        mapper: {
          serviceId: 'serviceId',
        },
      },
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
          id: 'action',
          header: {
            name: '액션',
          },
          cell: {
            buttons: [
              {
                color: 'primary',
                name: '추가',
                navigator: {
                  pathname: ':parentId/add',
                  mapper: {
                    id: 'parentId',
                  },
                },
              },
              {
                color: 'warning',
                name: '수정',
                navigator: {
                  pathname: ':categoryId/edit',
                  mapper: {
                    id: 'categoryId',
                  },
                },
              },
              {
                color: 'danger',
                name: '삭제',
                mutation: {
                  name: 'deleteCategory',
                  hasRowId: true,
                },
              },
            ],
          },
        },
      ],
    },
    buttons: [
      {
        name: '생성',
        navigator: {
          pathname: 'new/edit',
        },
      },
    ],
  },
};
