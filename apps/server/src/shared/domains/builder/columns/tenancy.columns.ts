import { Injectable } from '@nestjs/common';
import { ColumnBuilder } from '@shared/types';

@Injectable()
export class TenancyColumns {
  getMeta(): ColumnBuilder[] {
    const columns: ColumnBuilder[] = [
      {
        accessorKey: 'name',
        header: {
          name: '이름',
        },
      },
      {
        id: 'actions',
        header: {
          name: 'Actions',
        },
        cell: {
          buttons: [
            {
              name: '선택',
              navigator: {
                pathname: '/admin/main/tenancies/:tenancyId/services',
                mapper: {
                  id: 'tenancyId',
                },
              },
            },
          ],
        },
      },
    ];

    return columns;
  }
}
