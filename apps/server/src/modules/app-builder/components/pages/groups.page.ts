import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { ContextProvider } from '@shared';
import { DataGridBuilderProps, PageBuilder } from '@shared/types';

@Injectable()
export class GroupsPage {
  build(type: $Enums.GroupTypes): PageBuilder {
    return {
      name: '그룹 리스트',
      state: {},
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
                        name: 'useGetGroupsByQuery',
                        params: {
                          skip: 0,
                          take: 10,
                          type,
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
                          accessorKey: 'label',
                          header: {
                            name: '라벨',
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
                                    name: '그라운드 그룹 수정',
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
