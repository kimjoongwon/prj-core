---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/hooks/useMeta.ts
---

import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { GroupButton } from '@coc/shared';
import { useCoCRouter } from '@hooks';
import { useActionColumns, use<%= Name %>Columns } from '@columns';
import { <%= h.changeCase.upper(name) %>_EDIT_PAGE_PATH, <%= h.changeCase.upper(name) %>_PAGE_PATH } from '@constants';
import { User } from '@__generated__/graphql';

export const useMeta = () => {
  const router = useCoCRouter();
  const <%= name %>Columns = use<%= Name %>Columns();

  const actionColumns = useActionColumns<User>({
    meta: {
      buttons: [
        {
          children: '수정',
          onClick: context =>
            router.push({
              url: <%= h.changeCase.upper(name) %>_EDIT_PAGE_PATH,
              params: {
                <%= name %>Id: context.row.original.id,
              },
            }),
        },
        {
          children: '자세히 보기',
          onClick: context =>
            router.push({
              url: <%= h.changeCase.upper(name) %>_PAGE_PATH,
              params: {
                <%= name %>Id: context.row.original.id,
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
          url: <%= h.changeCase.upper(name) %>_EDIT_PAGE_PATH,
          params: {
            <%= name %>Id: 'new',
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
      () => [...<%= name %>Columns, ...actionColumns],
      [<%= name %>Columns, actionColumns],
    ),
  };
};

