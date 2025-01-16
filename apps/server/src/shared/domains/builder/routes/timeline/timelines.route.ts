import { RouteBuilder } from '@shared/types';

export class Timeline {
  constructor() {}

  getRoute(): RouteBuilder {
    return {
      name: 'TIMELINE',
      pathname: 'timeline',
      layout: {
        name: 'TIMELINE',
        page: {
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
