import { useCoCRouter } from '@common';
import { GroupButton } from '@coc/web';
import { useActionColumns, useUserColumns } from '@columns';
import { User } from '@__generated__/graphql';
import { useMemo } from 'react';
import { USER_EDIT_PAGE_PATH, USER_PAGE_PATH } from '@constants';
import { toast } from 'react-toastify';

export const useMeta = () => {
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
                userId: context.row.original.id,
              },
            }),
        },
        {
          children: '자세히 보기',
          onClick: context =>
            router.push({
              url: USER_PAGE_PATH,
              params: {
                userId: context.row.original.id,
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
      onClick: () => toast.error('삭제되었습니다.'),
    },
  ];

  return {
    userColumns: useMemo(() => userColumns, []),
    actionColumns: useMemo(() => actionColumns, []),
    leftButtons: useMemo(() => leftButtons, []),
    rightButtons: useMemo(() => rightButtons, []),
  };
};
