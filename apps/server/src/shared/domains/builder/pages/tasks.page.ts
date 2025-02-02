import { PageBuilder } from '@shared/types';
import { TaskColumns } from '../columns/task.columns';
import { NewEditButton } from '../buttons/new-edit.button';
import { ContextProvider } from '../../../providers';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksPage {
  constructor(
    readonly taskColumns: TaskColumns,
    readonly newEditButton: NewEditButton,
  ) {}
  getMeta() {
    const tenancyId = ContextProvider.getTenancyId();
    const columns = this.taskColumns.getMeta();
    const newEditButton = this.newEditButton.getMeta('tasks');
    const page: PageBuilder = {
      name: '리스트',
      type: 'Page',
      dataGrid: {
        buttons: [newEditButton],
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
