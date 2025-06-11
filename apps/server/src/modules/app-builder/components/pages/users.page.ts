import { Injectable } from '@nestjs/common';
import { PageBuilder, ButtonBuilder } from '@shared/types';
import { ContextProvider } from '../../../../shared/provider';
import { ColumnBuilderService } from '../column/column-builder.service';
import { DataGridBuilderService } from '../data-grid/data-grid-builder.service';

@Injectable()
export class UsersPage {
  constructor(
    private columnBuilderService: ColumnBuilderService,
    private dataGridBuilderService: DataGridBuilderService,
  ) {}

  build(): PageBuilder {
    const serviceId = ContextProvider.getServiceId();
    const tenantId = ContextProvider.getTenantId();

    const columns = this.columnBuilderService.build(
      'user',
      ['name', 'email'],
      ['modify', 'detail', 'remove'],
    );

    // Create a button for the DataGrid
    const createButton: ButtonBuilder = {
      children: '생성',
      color: 'primary',
      size: 'sm',
      // This would typically navigate to a create page or open a modal
      // For now, we'll just add a simple toast
      // navigator: {
      //   type: 'push',
      //   pathname: 'new/create',
      // },
    };

    const dataGrid = this.dataGridBuilderService.build({
      queryName: 'useGetUsersByQuery',
      columns,
      params: {
        serviceId,
        tenantId,
        skip: 0,
        take: 10,
      },
    });

    // Add the create button to the DataGrid
    dataGrid.buttons = [createButton];

    return {
      name: '사용자 리스트',
      dataGrid,
    };
  }
}
