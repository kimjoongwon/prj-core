import { RouteBuilder } from '@shared/types';

export class RoutinesRoute {
  constructor() {}
  getRoute(): RouteBuilder {
    return {
      layout: {
        type: 'DataGrid',
        page: {
          name: '루틴',
          type: 'Page',
          dataGrid: {
            table: {
              query: {
                name: 'useGetRoutinesByQuery',
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
    };
  }
}
