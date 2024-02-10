import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { GroupButton } from '@coc/shared';
import { useCoCRouter } from '@hooks';
import { useActionColumns, useSessionColumns } from '@columns';
import {
  SESSION_EDIT_PAGE_PATH,
  SESSION_PAGE_PATH,
  TIMELINES_PAGE_PATH,
} from '@constants';
import { User } from '@__generated__/graphql';

export const useMeta = () => {
  const router = useCoCRouter();
  const sessionColumns = useSessionColumns();

  const actionColumns = useActionColumns<User>({
    meta: {
      buttons: [
        {
          children: '수정',
          onClick: context =>
            router.push({
              url: SESSION_EDIT_PAGE_PATH,
              params: {
                sessionId: context.row.original.id,
              },
            }),
        },
        {
          children: '자세히 보기',
          onClick: context =>
            router.push({
              url: SESSION_PAGE_PATH,
              params: {
                sessionId: context.row.original.id,
              },
            }),
        },
        {
          children: '타임라인 생성/등록',
          onClick: context =>
            router.push({
              url: TIMELINES_PAGE_PATH,
              params: {
                sessionId: context.row.original.id,
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
          url: SESSION_EDIT_PAGE_PATH,
          params: {
            sessionId: 'new',
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
      () => [...sessionColumns, ...actionColumns],
      [sessionColumns, actionColumns],
    ),
  };
};
