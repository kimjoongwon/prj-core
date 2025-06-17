import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { ContextProvider } from '@shared';
import { DataGridBuilderProps, PageBuilder } from '@shared/types';

@Injectable()
export class CategoriesPage {
  build(categoryTypes: $Enums.CategoryTypes): PageBuilder {
    return {
      name: '카테고리 리스트',
      state: {
        inputs: {
          type: categoryTypes,
          tenantId: ContextProvider.getTenantId(),
          parentId: null,
          name: '',
          label: '',
        },
      },
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
                            expandable: true,
                            name: '이름',
                          },
                          cell: {
                            type: 'expandable',
                          },
                        },
                        {
                          accessorKey: 'type',
                          header: {
                            name: '타입',
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
                                children: '상세',
                                variant: 'solid',
                                navigator: {
                                  type: 'push',
                                  route: {
                                    name: '그라운드 카테고리 디테일',
                                    paramsPath: 'navigator.params',
                                  },
                                },
                              },
                              {
                                children: '수정',
                                variant: 'solid',
                                navigator: {
                                  type: 'push',
                                  route: {
                                    relativePath: ':id/modify',
                                    paramsPath: 'navigator.params',
                                  },
                                },
                              },
                              {
                                children: '추가',
                                variant: 'solid',
                                navigator: {
                                  type: 'push',
                                  route: {
                                    relativePath: ':id/add',
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
