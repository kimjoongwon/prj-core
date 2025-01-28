import { Injectable } from '@nestjs/common';
import { ColumnBuilder, DataGridBuilder, RouteBuilder } from '@shared/types';

@Injectable()
export class RoutinesBuilder {
  constructor() {}
  getRoutineRoute(): RouteBuilder {
    return {
      name: '루틴',
      pathname: 'routines',
      page: {
        name: '목록',
        type: 'Page',
        dataGrid: this.getDataGrid(),
      },
    };
  }

  getDataGrid(): DataGridBuilder {
    return {
      buttons: [
        {
          name: '생성',
          color: 'primary',
          navigator: {
            pathname: 'new/edit',
          },
        },
      ],
      table: {
        query: {
          name: 'useGetRoutinesByQuery',
        },
        columns: this.getColumns(),
      },
    };
  }

  getColumns(): ColumnBuilder[] {
    return [
      {
        accessorKey: 'name',
        header: {
          name: '이름',
        },
      },
    ];
  }
}
