import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';
import { ContextProvider } from '../../../providers/context.provider';
import { ColumnBuilderService } from '../column/column-builder.service';
import { DataGridBuilderService } from '../data-grid/data-grid-builder.service';

@Injectable()
export class GroundsPage {
  constructor(
    private columnBuilderService: ColumnBuilderService,
    private dataGridBuilderService: DataGridBuilderService,
  ) {}

  build(): PageBuilder {
    const serviceId = ContextProvider.getServiceId();
    const tenantId = ContextProvider.getTenantId();

    const columns = this.columnBuilderService.build(
      'ground',
      ['workspace.name', 'workspace.label'],
      ['edit', 'detail', 'remove', 'add'],
    );

    const dataGrid = this.dataGridBuilderService.build({
      queryName: 'useGetGroundsByQuery',
      columns,
      params: {
        skip: 0,
        take: 10,
      },
    });

    return {
      name: '리스트',
      dataGrid,
    };
  }
}
