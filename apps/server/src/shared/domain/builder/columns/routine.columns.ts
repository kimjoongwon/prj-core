import { Injectable } from '@nestjs/common';
import { ColumnBuilder } from '@shared/types';

@Injectable()
export class RoutineColumns {
  getMeta(): ColumnBuilder[] {
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

  getButtons() {
    const buttonColumn: ColumnBuilder = {
      id: 'actions',
      header: {
        name: 'Actions',
      },
      cell: {
        buttons: [],
      },
    };

    return buttonColumn;
  }
}
