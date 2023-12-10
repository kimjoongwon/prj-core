import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { GroupButton } from '@coc/ui';
import { useCoCRouter } from '@hooks';
import { useActionColumns, useRoleColumns } from '@columns';
import { ROLE_EDIT_PAGE_PATH, ROLE_PAGE_PATH } from '@constants';
import { User } from '@__generated__/graphql';
import { useMutations } from './useMutations';
import { useState } from './useState';

export const useMeta = ({
  mutations,
  state,
}: {
  state: ReturnType<typeof useState>;
  mutations: ReturnType<typeof useMutations>;
}) => {
  const {
    removeRole: [removeRole],
  } = mutations;
  const router = useCoCRouter();
  const roleColumns = useRoleColumns();

  const actionColumns = useActionColumns<User>({
    meta: {
      buttons: [
        {
          children: '수정',
          onClick: context =>
            router.push({
              url: ROLE_EDIT_PAGE_PATH,
              params: {
                roleId: context.row.original.id,
              },
            }),
        },
        {
          children: '자세히 보기',
          onClick: context =>
            router.push({
              url: ROLE_PAGE_PATH,
              params: {
                roleId: context.row.original.id,
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
          url: ROLE_EDIT_PAGE_PATH,
          params: {
            roleId: 'new',
          },
        }),
    },
  ];

  const rightButtons: GroupButton[] = [
    {
      children: '삭제',
      color: 'danger',
      onClick: () => {
        removeRole({
          variables: {
            id: state.table.selectedRowIds[0],
          },
        });
        toast.error('삭제되었습니다.');
      },
    },
  ];

  return {
    leftButtons: useMemo(() => leftButtons, []),
    rightButtons: useMemo(() => rightButtons, []),
    columns: useMemo(
      () => [...roleColumns, ...actionColumns],
      [roleColumns, actionColumns],
    ),
  };
};
