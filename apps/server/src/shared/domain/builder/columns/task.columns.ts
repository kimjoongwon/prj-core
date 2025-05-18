import { Injectable } from '@nestjs/common';
import { ColumnBuilder } from '@shared/types';

@Injectable()
export class TaskColumns {
  getMeta() {
    const columns: ColumnBuilder[] = [
      {
        accessorKey: 'name',
        header: {
          name: '이름',
        },
      },
    ];

    return columns;
  }
}
