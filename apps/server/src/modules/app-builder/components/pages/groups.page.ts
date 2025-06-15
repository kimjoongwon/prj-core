import { Injectable } from '@nestjs/common';
import { DataGridBuilderProps, PageBuilder } from '@shared/types';

@Injectable()
export class GroupsPage {
  build(): PageBuilder {
    return {
      name: '그룹 리스트',
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
                            fullPath: '/admin/dashboard/space-service/groups/:id/create',
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
                            resourceName: 'group',
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
