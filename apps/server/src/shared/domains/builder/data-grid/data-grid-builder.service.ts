import { Injectable } from '@nestjs/common';
import { ColumnBuilder, DataGridBuilder } from '@shared/types';

@Injectable()
export class DataGridBuilderService {
  build({
    columns,
    params,
    queryName,
  }: {
    columns?: ColumnBuilder[];
    params?: Record<string, any>;
    queryName?: string;
  }): DataGridBuilder {
    return {
      table: {
        query: {
          name: queryName,
          params,
        },
        columns,
      },
      buttons: [
        {
          name: '생성',
          navigator: {
            pathname: `new/edit`,
          },
        },
      ],
    };
  }
}
