import { PageBuilder } from '@shared/types';

export const groupsPage: PageBuilder = {
  type: 'Page',
  dataGrid: {
    table: {
      query: {
        name: 'useGetGroupsByQuery',
        hasParams: true,
        hasServiceId: true,
        params: {
          serviceId: '',
          skip: 0,
          take: 2,
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
                color: 'secondary',
                name: '상세',
                navigator: {
                  pathname: ':resourceId',
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
                  name: 'deleteGroup',
                  idMapper: 'rowId',
                },
                alert: {
                  message: '!!!',
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
