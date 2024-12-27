import { PageBuilder } from '@shared/types';

export const groupsPage: PageBuilder = {
  type: 'Page',
  query: {
    name: 'useGetGroupsByQuery',
    hasParams: true,
    hasServiceId: true,
    params: {
      serviceId: '',
    },
  },
  table: {
    buttons: [
      {
        name: '생성',
        navigator: {
          pathname: 'new/edit',
        },
      },
    ],
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
                name: 'deleteGroup',
                hasRowId: true,
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
};
