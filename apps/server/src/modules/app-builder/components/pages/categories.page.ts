import { Injectable } from '@nestjs/common';
import { ContextProvider } from '@shared';
import { DataGridBuilderProps, PageBuilder } from '@shared/types';

@Injectable()
export class CategoriesPage {
  build(): PageBuilder {
    return {
      name: '카테고리 리스트',
      sections: [
        {
          stacks: [
            {
              type: 'VStack' as const,
              elements: [
                {
                  name: 'DataGridBuilder',
                  props: {
                    buttons: [
                      {
                        children: '생성',
                        variant: 'solid',
                        color: 'primary',
                        size: 'md',
                        navigator: {
                          type: 'push',
                          route: {
                            fullPath: '/admin/dashboard/space-service/categories/:id/create',
                            params: {
                              id: 'new',
                            },
                          },
                        },
                      },
                    ],
                    table: {
                      query: {
                        name: 'useGetCategoriesByQuery',
                        params: {
                          skip: 0,
                          take: 10,
                          tenantId: ContextProvider.getTenantId(),
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'name',
                          header: {
                            name: '이름',
                          },
                        },
                        {
                          accessorKey: 'type',
                          header: {
                            name: '타입',
                          },
                        },
                        {
                          accessorKey: 'parent.name',
                          header: {
                            name: '상위 카테고리',
                          },
                        },
                        {
                          accessorKey: 'actions',
                          header: {
                            name: '액션',
                          },
                          cell: {
                            type: 'row-actions',
                            resourceName: 'Category',
                          },
                        },
                      ],
                    },
                  } satisfies DataGridBuilderProps,
                },
              ],
            },
          ],
        },
      ],
    };
  }
}
