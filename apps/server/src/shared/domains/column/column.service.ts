import { Injectable } from '@nestjs/common';
import { ColumnBuilder } from '@shared/types';

@Injectable()
export class ColumnService {
  constructor() {}

  getCommonColumns(): ColumnBuilder[] {
    const columns: ColumnBuilder[] = [
      {
        accessorKey: 'seq',
        header: {
          name: '번호',
        },
      },
      {
        accessorKey: 'createdAt',
        cell: {
          type: 'dateTime',
        },
        header: {
          name: '생성일',
        },
      },
      {
        accessorKey: 'updatedAt',
        cell: {
          type: 'dateTime',
        },
        header: {
          name: '수정일',
        },
      },
    ];

    return columns;
  }

  getActionColumn(): ColumnBuilder {
    return {
      id: 'action',
      header: {
        name: '액션',
      },
      cell: {
        buttons: [
          {
            color: 'primary',
            name: '수정',
            navigator: {
              pathname: 'edit',
            },
          },
          {
            color: 'danger',
            name: '삭제',
            mutation: {
              name: 'deleteSpace',
            },
          },
        ],
      },
    };
  }
}
