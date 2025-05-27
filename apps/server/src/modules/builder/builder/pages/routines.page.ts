import { Injectable } from '@nestjs/common';
import { DataGridBuilder, PageBuilder } from '@shared/types';
import { RoutineColumns } from '../columns/routine.columns';

@Injectable()
export class RoutinesPage {
  constructor(readonly routineColumns: RoutineColumns) {}
  getMeta(): PageBuilder {
    return {
      name: '목록',
      type: 'Page',
      dataGrid: this.getDataGrid(),
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
