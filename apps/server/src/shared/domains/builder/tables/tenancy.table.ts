import { Injectable } from '@nestjs/common';
import { TableBuilder } from '@shared/types';
import { TenancyColumns } from '../columns/tenancy.columns';

@Injectable()
export class TenancyTable {
  constructor(private readonly tenancyColumns: TenancyColumns) {}

  getMeta(): TableBuilder {
    const columns = this.tenancyColumns.getMeta();
    const table: TableBuilder = {
      query: {
        name: 'useGetSpacesByQuery',
      },
      columns,
    };

    return table;
  }
}
