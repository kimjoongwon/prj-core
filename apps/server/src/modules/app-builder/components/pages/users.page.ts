import { Injectable } from '@nestjs/common';
import { DataGridBuilderProps, PageBuilder } from '@shared/types';

@Injectable()
export class UsersPage {
  build(): PageBuilder {
    return {
      name: '사용자 리스트',
      sections: [
        {
          stacks: [
            {
              type: 'VStack' as const,
              elements: [
                {
                  name: 'DataGridBuilder',
                  props: {
                    table: {
                      query: {
                        name: 'useGetUsersByQuery',
                      },
                      columns: [
                        {
                          accessorKey: 'name',
                          header: {
                            name: '이름',
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
