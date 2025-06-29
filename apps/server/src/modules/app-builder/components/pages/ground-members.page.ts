import { DataGridBuilderProps, IButtonBuilder, PageBuilder } from '@shared/types';

export const getGroundMembersPage = (): PageBuilder => {
    return {
      name: '그라운드 멤버 리스트',
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
                        children: '멤버 추가',
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
                        // TODO: 쿼리명을 적절히 변경해주세요
                        name: 'useGetTenantsByQuery',
                        params: {
                          skip: 0,
                          take: 10,
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'user.name',
                          header: {
                            name: '이름',
                          },
                        },
                        {
                          accessorKey: 'user.email',
                          header: {
                            name: '이메일',
                          },
                        },
                        {
                          accessorKey: 'user.phone',
                          header: {
                            name: '전화번호',
                          },
                        },
                        {
                          accessorKey: 'role',
                          header: {
                            name: '역할',
                          },
                        },
                        {
                          accessorKey: 'status',
                          header: {
                            name: '상태',
                          },
                        },
                        {
                          accessorKey: 'joinedAt',
                          header: {
                            name: '가입일',
                          },
                          cell: {
                            type: 'date',
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
                                    relativePath: ':memberId/detail',
                                    pathParams: {
                                      memberId: 'selectedRow.id',
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
                                    relativePath: ':memberId/modify',
                                    pathParams: {
                                      memberId: 'selectedRow.id',
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
                                  name: 'deleteGroundMemberById',
                                  pathParams: {
                                    memberId: 'selectedRow.id',
                                  },
                                  queryKey: '/api/v1/ground-members',
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
};
