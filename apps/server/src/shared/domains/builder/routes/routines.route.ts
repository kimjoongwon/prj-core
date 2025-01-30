import { Injectable } from '@nestjs/common';
import { DataGridBuilder, RouteBuilder } from '@shared/types';
import { RoutineColumns } from '../columns';

@Injectable()
export class RoutinesRoute {
  constructor(readonly routineColumns: RoutineColumns) {}
  getMeta(): RouteBuilder {
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
            pathname: 'routines/new/edit',
          },
        },
      ],
      table: {
        query: {
          name: 'useGetRoutinesByQuery',
        },
        columns: this.routineColumns.getMeta(),
      },
    };
  }
}
