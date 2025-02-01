import { Injectable } from '@nestjs/common';
import { ColumnBuilder } from '@shared/types';

@Injectable()
export class CategoryColumns {
  getMeta(): ColumnBuilder[] {
    const columns: ColumnBuilder[] = [
      {
        accessorKey: 'name',
        header: {
          name: '이름',
          expandable: true,
        },
        cell: {
          expandable: true,
        },
      },
    ];

    return columns;
  }
}
