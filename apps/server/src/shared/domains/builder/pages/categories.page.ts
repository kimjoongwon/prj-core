import { PageBuilder } from '@shared/types';

export const categoriesPage: PageBuilder = {
  type: 'Page',
  dataGrid: {
    table: {
      query: {
        name: 'useGetCategoriesByQuery',
        hasParams: true,
        hasServiceId: true,
        params: {
          serviceId: '',
          type: 'ROOT',
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
                  hasParentId: true,
                  params: {
                    parentId: '',
                  },
                },
              },
              {
                color: 'warning',
                name: '수정',
                navigator: {
                  pathname: ':resourceId/edit',
                  hasResourceId: true,
                  params: {
                    resourceId: '',
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
