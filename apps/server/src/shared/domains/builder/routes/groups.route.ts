import { RouteBuilder } from '@shared/types';

export class GroupsRoute {
  getMeta() {
    const route: RouteBuilder = {
      name: '그룹',
      page: {
        type: 'Page',
        name: '목록',
        dataGrid: {
          table: {
            query: {
              name: 'useGetGroupsByQuery',
              params: {
                serviceId: '',
                skip: 0,
                take: 2,
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
                      name: '수정',
                      navigator: {
                        pathname: ':groupId/edit',
                        mapper: {
                          id: 'groupId',
                        },
                      },
                    },
                    {
                      color: 'secondary',
                      name: '상세',
                      navigator: {
                        pathname: ':groupId',
                        mapper: {
                          id: 'groupId',
                        },
                      },
                    },
                    {
                      color: 'danger',
                      name: '삭제',
                      mutation: {
                        name: 'deleteGroup',
                        idMapper: 'id',
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
      },
    };

    return route;
  }
}
