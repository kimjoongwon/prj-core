import { Injectable } from '@nestjs/common';
import { ColumnBuilder } from '@shared/types';

@Injectable()
export class CategoryColumns {
  constructor() {}

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
      {
        id: 'action',
        header: {
          name: '액션',
        },
        cell: {
          buttons: [
            {
              icon: 'detail',
              color: 'primary',
              name: '상세',
              navigator: {
                pathname: '/admin/main/tenancies/:tenancyId/services/:service/:categoryId',
                mapper: {
                  id: 'categoryId',
                },
              },
            },
            {
              icon: 'add',
              color: 'secondary',
              name: '추가',
              navigator: {
                pathname: 'categories/:categoryId/add',
                mapper: {
                  id: 'categoryId',
                },
              },
            },
            {
              icon: 'edit',
              color: 'warning',
              name: '수정',
              navigator: {
                pathname: 'categories/:categoryId/edit',
                mapper: {
                  id: 'categoryId',
                },
              },
            },
            {
              icon: 'delete',
              color: 'danger',
              name: '삭제',
              mutation: {
                name: 'deleteCategory',
                idMapper: 'id',
              },
            },
          ],
        },
      },
    ];

    return columns;
  }
}
