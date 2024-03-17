import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { GroupButton } from '@coc/web';
import { useCoCRouter } from '@hooks';
import { useActionColumns, useTimelineItemColumns } from '@columns';
import {
  TIMELINEITEM_EDIT_PAGE_PATH,
  TIMELINEITEM_PAGE_PATH,
} from '@constants';
import { User } from '@__generated__/graphql';
import { useParams } from 'next/navigation';

export const useMeta = () => {
  const router = useCoCRouter();
  const timelineItemColumns = useTimelineItemColumns();
  const { sessionId, timelineId, timelineItemId } = useParams<{
    sessionId: string;
    timelineId: string;
    timelineItemId: string;
  }>();
  const actionColumns = useActionColumns<User>({
    meta: {
      buttons: [
        {
          children: '수정',
          onClick: context =>
            router.push({
              url: TIMELINEITEM_EDIT_PAGE_PATH,
              params: {
                timelineItemId: context.row.original.id,
              },
            }),
        },
        {
          children: '자세히 보기',
          onClick: context =>
            router.push({
              url: TIMELINEITEM_PAGE_PATH,
              params: {
                timelineItemId: context.row.original.id,
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
          url: TIMELINEITEM_EDIT_PAGE_PATH,
          params: {
            sessionId,
            timelineId,
            timelineItemId: 'new',
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
      () => [...timelineItemColumns, ...actionColumns],
      [timelineItemColumns, actionColumns],
    ),
  };
};
