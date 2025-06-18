import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { ContextProvider } from '@shared';
import { DataGridBuilderProps, IButtonBuilder, PageBuilder } from '@shared/types';

@Injectable()
export class CategoriesPage {
  build(categoryTypes: $Enums.CategoryTypes): PageBuilder {
    return {
      name: '카테고리 리스트',
      state: {
        inputs: {
          type: categoryTypes,
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
                        children: '카테고리 생성',
                        variant: 'solid',
                        color: 'primary',
                        size: 'md',
                        radius: 'lg',
                        startContent: 'plus-circle',
                        className:
                          'font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200',
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
                                variant: 'light',
                                size: 'sm',
                                color: 'primary',
                                radius: 'sm',
                                isIconOnly: false,
                                startContent: 'eye',
                                className: 'min-w-unit-14 text-xs px-2 py-1',
                                navigator: {
                                  type: 'push',
                                  route: {
                                    name: '그라운드 카테고리 디테일',
                                    paramPaths: ['selectedRow.id'],
                                  },
                                },
                              } satisfies IButtonBuilder,
                              {
                                children: '수정',
                                variant: 'light',
                                size: 'sm',
                                color: 'warning',
                                radius: 'sm',
                                isIconOnly: false,
                                startContent: 'edit',
                                className: 'min-w-unit-14 text-xs px-2 py-1',
                                navigator: {
                                  type: 'push',
                                  route: {
                                    relativePath: ':id/modify',
                                    paramPaths: ['selectedRow.id'],
                                  },
                                },
                              } satisfies IButtonBuilder,
                              {
                                children: '추가',
                                variant: 'light',
                                size: 'sm',
                                color: 'success',
                                radius: 'sm',
                                isIconOnly: false,
                                startContent: 'plus',
                                className: 'min-w-unit-14 text-xs px-2 py-1',
                                navigator: {
                                  type: 'push',
                                  route: {
                                    relativePath: ':id/add',
                                    paramPaths: ['selectedRow.id'],
                                  },
                                },
                              } satisfies IButtonBuilder,
                              {
                                children: '삭제',
                                variant: 'light',
                                size: 'sm',
                                color: 'danger',
                                radius: 'sm',
                                isIconOnly: false,
                                startContent: 'trash',
                                className: 'min-w-unit-14 text-xs px-2 py-1',
                                mutation: {
                                  name: 'deleteCategoryById',
                                  hasId: true,
                                  idPath: 'selectedRow.id',
                                  queryKey: '/api/v1/categories',
                                },
                              } satisfies IButtonBuilder,
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
