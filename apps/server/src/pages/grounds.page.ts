import { DataGridBuilderProps, IButtonBuilder, PageBuilder } from '@shared/types';

export const getGroundsPage = (): PageBuilder => {
    return {
      name: '그라운드 리스트',
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
                    relativePath: 'new/create',
                  },
                },
              },
            ],
            table: {
              type: 'table' as const,
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
                            relativePath: ':groundId/detail',
                            pathParams: {
                              groundId: 'selectedRow.id',
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
                            relativePath: ':groundId/modify',
                            pathParams: {
                              groundId: 'selectedRow.id',
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
                          name: 'deleteGroundById',
                          pathParams: {
                            groundId: 'selectedRow.id', // pageState.selectedRow.id에서 ID를 가져옴
                          },
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
    };
};
