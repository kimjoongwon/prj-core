import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';
import { ContextProvider } from '../../../providers/context.provider';
import { ColumnBuilderService } from '../column/column-builder.service';
import { DataGridBuilderService } from '../data-grid/data-grid-builder.service';

@Injectable()
export class GymsPage {
  constructor(
    private columnBuilderService: ColumnBuilderService,
    private dataGridBuilderService: DataGridBuilderService,
  ) {}

  build(): PageBuilder {
    const serviceId = ContextProvider.getServiceId();
    const tenantId = ContextProvider.getTenantId();

    const columns = this.columnBuilderService.build(
      'gym',
      ['name'],
      ['edit', 'detail', 'remove', 'add'],
    );

    const dataGrid = this.dataGridBuilderService.build({
      queryName: 'useGetGymsByQuery',
      columns,
      params: {
        serviceId,
        tenantId,
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
