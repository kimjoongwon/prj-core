import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { GroupButton } from '@coc/ui';
import { useCoCRouter } from '@hooks';
import { useActionColumns, useWorkspaceColumns } from '@columns';
import { WORKSPACE_EDIT_PAGE_PATH, WORKSPACE_PAGE_PATH } from '@constants';
import { User } from '@__generated__/graphql';

export const useMeta = () => {
  const router = useCoCRouter();
  const workspaceColumns = useWorkspaceColumns();

  const actionColumns = useActionColumns<User>({
    meta: {
      buttons: [
        {
          children: '수정',
          onClick: context =>
            router.push({
              url: WORKSPACE_EDIT_PAGE_PATH,
              params: {
                workspaceId: context.row.original.id,
              },
            }),
        },
        {
          children: '자세히 보기',
          onClick: context =>
            router.push({
              url: WORKSPACE_PAGE_PATH,
              params: {
                workspaceId: context.row.original.id,
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
          url: WORKSPACE_EDIT_PAGE_PATH,
          params: {
            workspaceId: 'new',
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
    leftButtons: useMemo(() => leftButtons, []),
    rightButtons: useMemo(() => rightButtons, []),
    columns: useMemo(
      () => [...workspaceColumns, ...actionColumns],
      [workspaceColumns, actionColumns],
    ),
  };
};

