import { $Enums } from '@prisma/client';
import { DataGridBuilderProps, IButtonBuilder, PageBuilder } from '@shared/types';
import { ContextProvider } from '@shared';

export const getCategoriesPage = (categoryTypes: $Enums.CategoryTypes): PageBuilder => {
  return {
    name: '카테고리 리스트',
    state: {
      inputs: {
        type: categoryTypes,
        parentId: null,
        name: '',
        label: '',
        tenantId: ContextProvider.getTenantId(),
      },
    },
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
                  fullPath: '/admin/dashboard/space-service/categories/new/create',
                },
              },
            },
          ],
          table: {
            type: 'table' as const,
            query: {
              name: 'useGetCategoriesByQuery',
              params: {
                skip: 0,
                take: 10,
                type: categoryTypes,
                tenantId: ContextProvider.getTenantId(),
              },
            },
            pagination: {
              enabled: true,
              defaultTake: 10,
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
                          pathParams: {
                            categoryId: 'selectedRow.id',
                          },
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
                          relativePath: ':categoryId/modify',
                          pathParams: {
                            categoryId: 'selectedRow.id',
                          },
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
                          relativePath: ':categoryId/add',
                          pathParams: {
                            categoryId: 'selectedRow.id',
                          },
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
                        name: 'deleteCategory',
                        pathParams: {
                          categoryId: 'selectedRow.id', // pageState.selectedRow.id에서 ID를 가져옴
                        },
                        queryKey: 'useGetCategoriesByQuery',
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
  };
};
