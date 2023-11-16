import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { GroupButton } from '@coc/ui';
import { useCoCRouter } from '@hooks';
import { useActionColumns, useSpaceColumns } from '@columns';
import { SPACE_EDIT_PAGE_PATH, SPACE_PAGE_PATH } from '@constants';
import { User } from '@__generated__/graphql';

export const useMeta = () => {
  const router = useCoCRouter();
  const spaceColumns = useSpaceColumns();

  const actionColumns = useActionColumns<User>({
    meta: {
      buttons: [
        {
          children: '수정',
          onClick: context =>
            router.push({
              url: SPACE_EDIT_PAGE_PATH,
              params: {
                spaceId: context.row.original.id,
              },
            }),
        },
        {
          children: '자세히 보기',
          onClick: context =>
            router.push({
              url: SPACE_PAGE_PATH,
              params: {
                spaceId: context.row.original.id,
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
          url: SPACE_EDIT_PAGE_PATH,
          params: {
            spaceId: 'new',
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
      () => [...spaceColumns, ...actionColumns],
      [spaceColumns, actionColumns],
    ),
  };
};

