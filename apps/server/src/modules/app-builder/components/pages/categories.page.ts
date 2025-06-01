import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/specs';
import { ContextProvider } from '../../../../shared/provider/context.provider';
import { ColumnBuilderService } from '../column/column-builder.service';
import { DataGridBuilderService } from '../data-grid/data-grid-builder.service';

@Injectable()
export class CategoriesPage {
  constructor(
    private columnBuilderService: ColumnBuilderService,
    private dataGridBuilderService: DataGridBuilderService,
  ) {}

  build(): PageBuilder {
    const serviceId = ContextProvider.getServiceId();
    const tenantId = ContextProvider.getTenantId();

    const columns = this.columnBuilderService.build(
      'category',
      ['name'],
      ['modify', 'detail', 'remove', 'create'],
    );

    const dataGrid = this.dataGridBuilderService.build({
      queryName: 'useGetCategoriesByQuery',
      columns,
      params: {
        type: 'ROOT',
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
