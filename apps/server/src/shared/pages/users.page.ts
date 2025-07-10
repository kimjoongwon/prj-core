import type { DataGridBuilderProps, PageBuilder } from '@shared/types';

export const getUsersPage = (): PageBuilder => {
  return {
    name: '사용자 리스트',
    elements: [
      {
        name: 'DataGridBuilder',
        props: {
          table: {
            type: 'table' as const,
            query: {
              name: 'useGetUsersByQuery',
              params: {
                skip: 0,
                take: 10,
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
                  name: '이름',
                },
              },
              {
                accessorKey: 'phone',
                header: {
                  name: '전화번호',
                },
              },
            ],
          },
        } satisfies DataGridBuilderProps,
      },
    ],
  };
};
