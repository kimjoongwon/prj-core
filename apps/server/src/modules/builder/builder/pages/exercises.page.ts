import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';
import { ActionColumns } from '../columns/action.columns';
import { ExerciseDto } from '../../../../shared/dto';

@Injectable()
export class ExercisesPage {
  constructor(private readonly actionColumns: ActionColumns) {}
  getMeta() {
    const actionColumns = this.actionColumns.getMeta();
    const page: PageBuilder<Partial<ExerciseDto>> = {
      type: 'Page',
      name: '목록',
      dataGrid: {
        table: {
          query: {
            name: 'useGetExercisesByQuery',
            params: {
              skip: 0,
              take: 2,
            },
          },
          columns: [
            {
              accessorKey: 'id',
              header: {
                name: 'ID',
              },
            },
            ...actionColumns,
          ],
        },
        buttons: [
          {
            name: '생성',
            navigator: {
              pathname: 'exercises/new/edit',
            },
          },
        ],
      },
    };

    return page;
  }
}
