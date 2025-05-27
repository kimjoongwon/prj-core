import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';
import { ContextProvider } from '../../../../shared/provider';
import { ColumnBuilderService } from '../column/column-builder.service';
import { DataGridBuilderService } from '../data-grid/data-grid-builder.service';

@Injectable()
export class GroupsPage {
  constructor(
    private dataGridBuilderService: DataGridBuilderService,
    private columnBuilderService: ColumnBuilderService,
  ) {}

  getMeta() {
    const serviceId = ContextProvider.getServiceId();
    const columns = this.columnBuilderService.build(
      'group',
      ['name', 'label'],
      ['edit', 'detail', 'remove'],
    );

    const dataGrid = this.dataGridBuilderService.build({
      queryName: 'useGetGroupsByQuery',
      columns,
      params: {
        serviceId,
        skip: 0,
        take: 10,
      },
    });

    const page: PageBuilder = {
      name: '리스트',
      dataGrid,
    };

    return page;
  }
}
