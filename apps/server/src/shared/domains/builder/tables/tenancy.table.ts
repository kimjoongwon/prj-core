import { Injectable } from '@nestjs/common';
import { TableBuilder } from '@shared/types';

@Injectable()
export class TenancyTable {
  constructor() {}

  getMeta(): TableBuilder {
    const table: TableBuilder = {
      query: {
        name: 'useGetTenantsByQuery',
      },
      columns: [
        {
          accessorKey: 'space.name',
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
                  pathname: '/admin/main/tenants/:rowId/services',
                  idName: 'tenantId',
                },
              },
            ],
          },
        },
      ],
    };

    return table;
  }
}
