import { Injectable } from '@nestjs/common';
import { DataGridBuilderProps, PageBuilder } from '@shared/types';

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
                        children: '생성',
                        variant: 'solid',
                        color: 'primary',
                        size: 'md',
                        navigator: {
                          type: 'push',
                          route: {
                            fullPath: '/admin/dashboard/space-service/grounds/:id/create',
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
