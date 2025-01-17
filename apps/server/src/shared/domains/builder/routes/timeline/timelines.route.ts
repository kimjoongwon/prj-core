import { RouteBuilder } from '@shared/types';

export class TimelinesRoute {
  constructor() {}

  getRoute(): RouteBuilder {
    return {
      name: '목록',
      pathname: 'timeline',
      layout: {
        type: 'DataGrid',
        name: '목록',
        page: {
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
              ],
            },
          },
        },
      },
      children: [],
    };
  }
}
