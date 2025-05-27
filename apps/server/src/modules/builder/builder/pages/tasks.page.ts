import { PageBuilder } from '@shared/types';
import { TaskColumns } from '../columns/task.columns';
import { ContextProvider } from '../../../../shared/provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksPage {
  constructor(readonly taskColumns: TaskColumns) {}
  getMeta() {
    const tenancyId = ContextProvider.getTenancyId();
    const columns = this.taskColumns.getMeta();
    // const newEditButton = this.newEditButton.getMeta('tasks');
    const page: PageBuilder = {
      name: '리스트',
      type: 'Page',
      dataGrid: {
        buttons: [],
        table: {
          query: {
            name: 'useGetTasksByQuery',
            params: {
              tenancyId,
            },
          },
          columns,
        },
      },
    };

    return page;
  }
}
