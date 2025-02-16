import { PageBuilder } from '@shared/types';
import { TenancyTable } from '../tables/tenancy.table';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantsPage {
  constructor(private readonly tenancyTable: TenancyTable) {}
  getMeta(): PageBuilder {
    const table = this.tenancyTable.getMeta();
    const page: PageBuilder = {
      type: 'Page',
      name: '공간',
      dataGrid: {
        table: {
          query: {
            name: 'useGetTenantsByQuery',
          },
          columns: table.columns,
        },
      },
    };

    return page;
  }
}
