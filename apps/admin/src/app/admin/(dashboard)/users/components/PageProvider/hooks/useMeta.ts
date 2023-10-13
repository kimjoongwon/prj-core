import { useCoCRouter, useCoCTable } from '@hooks';
import { GroupButton } from '@coc/ui';
import { useActionColumns, useUserColumns } from '@columns';
import { User } from '@__generated__/graphql';
import { useMemo } from 'react';
import { useQueries } from './useQueries';
import { useHandlers } from './useHandlers';
import { USER_EDIT_PAGE_PATH, USER_PAGE_PATH } from '@constants';

export const useMeta = ({
  usersQuery,
  onClickRow,
  onClickSorting,
}: ReturnType<typeof useQueries> & ReturnType<typeof useHandlers>) => {
  const router = useCoCRouter();

  const userColumns = useUserColumns();

  const actionColumns = useActionColumns<User>({
    meta: {
      buttons: [
        {
          children: '수정',
          onClick: context =>
            router.push({
              url: USER_EDIT_PAGE_PATH,
              params: {
                userId: context.row.original.cuid,
              },
            }),
        },
        {
          children: '자세히 보기',
          onClick: context =>
            router.push({
              url: USER_PAGE_PATH,
              params: {
                userId: context.row.original.cuid,
              },
            }),
        },
      ],
    },
  });

  const leftButtons: GroupButton[] = [
    {
      children: '생성',
      color: 'primary',
      onClick: () =>
        router.push({
          url: USER_EDIT_PAGE_PATH,
          params: {
            userId: 'new',
          },
        }),
    },
  ];

  const rightButtons: GroupButton[] = [
    {
      children: '삭제',
      color: 'danger',
    },
  ];

  const table = useCoCTable<User>({
    data: usersQuery.data?.users?.nodes || [],
    columns: [...userColumns, ...actionColumns],
  });

  return {
    buttonGroup: {
      leftButtons: useMemo(() => leftButtons, []),
      rightButtons: useMemo(() => rightButtons, []),
    },
    dataGrid: {
      instance: table,
      data: usersQuery?.data?.users.nodes,
      onClickRow,
      onClickSorting,
    },
    pagination: {
      totalCount: useMemo(
        () => usersQuery?.data?.users.pageInfo?.totalCount || 1,
        [],
      ),
    },
  };
};
