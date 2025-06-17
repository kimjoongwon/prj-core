import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { ContextProvider } from '@shared';
import { DataGridBuilderProps, PageBuilder } from '@shared/types';

@Injectable()
export class CategoriesPage {
  build(categoryTypes: $Enums.CategoryTypes): PageBuilder {
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
                          type: categoryTypes,
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
                            buttons: [
                              {
                                children: '수정',
                                variant: 'solid',
                                navigator: {
                                  type: 'push',
                                  route: {
                                    name: '그라운드 카테고리 수정',
                                    paramsPath: 'navigator.params',
                                  },
                                },
                              },
                            ],
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
