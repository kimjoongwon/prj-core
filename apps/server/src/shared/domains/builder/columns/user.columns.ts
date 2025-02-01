import { Injectable } from '@nestjs/common';
import { ColumnBuilder } from '@shared/types';

@Injectable()
export class UserColumns {
  getMeta() {
    const columns: ColumnBuilder[] = [
      {
        accessorKey: 'name',
        header: {
          name: '이름',
        },
      },
      {
        accessorKey: 'phone',
        header: {
          name: '연락처',
        },
      },
    ];

    return columns;
  }
}
