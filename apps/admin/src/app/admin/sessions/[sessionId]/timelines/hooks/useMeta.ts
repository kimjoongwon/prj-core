import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { GroupButton } from '@coc/shared';
import { useCoCRouter } from '@hooks';
import { useActionColumns, useTimelineColumns } from '@columns';
import { TIMELINE_EDIT_PAGE_PATH, TIMELINE_PAGE_PATH } from '@constants';
import { User } from '@__generated__/graphql';
import { useParams } from 'next/navigation';

export const useMeta = () => {
  const router = useCoCRouter();
  const timelineColumns = useTimelineColumns();
  const { sessionId } = useParams();

  const actionColumns = useActionColumns<User>({
    meta: {
      buttons: [
        {
          children: '수정',
          onClick: context =>
            router.push({
              url: TIMELINE_EDIT_PAGE_PATH,
              params: {
                timelineId: context.row.original.id,
              },
            }),
        },
        {
          children: '자세히 보기',
          onClick: context =>
            router.push({
              url: TIMELINE_PAGE_PATH,
              params: {
                timelineId: context.row.original.id,
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
          url: TIMELINE_EDIT_PAGE_PATH,
          params: {
            timelineId: 'new',
            sessionId: sessionId as string,
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
      () => [...timelineColumns, ...actionColumns],
      [timelineColumns, actionColumns],
    ),
  };
};
