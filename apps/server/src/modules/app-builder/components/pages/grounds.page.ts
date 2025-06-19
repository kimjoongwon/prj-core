import { Injectable } from '@nestjs/common';
import { DataGridBuilderProps, IButtonBuilder, PageBuilder } from '@shared/types';

@Injectable()
export class GroundsPage {
  build(): PageBuilder {
    return {
      name: '그라운드 리스트',
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
                        children: '그라운드 생성',
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
                            relativePath: ':id/create',
                            params: {
                              id: 'new',
                            },
                          },
                        },
                      },
                    ],
                    table: {
                      query: {
                        name: 'useGetGroundsByQuery',
                        params: {
                          skip: 0,
                          take: 10,
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'name',
                          header: {
                            name: '사업장명',
                          },
                        },
                        {
                          accessorKey: 'label',
                          header: {
                            name: '라벨',
                          },
                        },
                        {
                          accessorKey: 'address',
                          header: {
                            name: '주소',
                          },
                        },
                        {
                          accessorKey: 'businessNo',
                          header: {
                            name: '사업자등록번호',
                          },
                        },
                        {
                          accessorKey: 'phone',
                          header: {
                            name: '전화번호',
                          },
                        },
                        {
                          accessorKey: 'email',
                          header: {
                            name: '이메일',
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
                                    relativePath: ':id/detail',
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
                                children: '삭제',
                                variant: 'light',
                                size: 'sm',
                                color: 'danger',
                                radius: 'sm',
                                isIconOnly: false,
                                startContent: 'trash',
                                className: 'min-w-unit-14 text-xs px-2 py-1',
                                mutation: {
                                  name: 'deleteGroundById',
                                  hasId: true,
                                  idPath: 'selectedRow.id',
                                  queryKey: '/api/v1/grounds',
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
