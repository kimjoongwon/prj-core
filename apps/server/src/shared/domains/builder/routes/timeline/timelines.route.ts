import { RouteBuilder } from '@shared/types';

export class TimelinesRoute {
  constructor() {}

  getRoute(): RouteBuilder {
    return {
      name: '목록',
      pathname: 'timelines',
      layout: {
        type: 'DataGrid',
        name: '목록',
        page: {
          type: 'Page',
          name: '목록',
          state: {
            form: {
              data: {
                categoryId: '',
                tenantId: '',
                timelineName: '',
              },
            },
          },
          dataGrid: {
            buttons: [
              {
                name: '추가',
                navigator: {
                  pathname: 'new/edit',
                },
              },
            ],
            table: {
              query: {
                name: 'useGetTimelinesByQuery',
              },
              columns: [
                {
                  accessorKey: 'name',
                  header: {
                    name: '이름',
                  },
                },
                {
                  id: 'actions',
                  header: {
                    name: '액션',
                  },
                  cell: {
                    buttons: [
                      {
                        name: '상세',
                        color: 'primary',
                        navigator: {
                          pathname: ':timelineId',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
      children: [],
    };
  }
}
