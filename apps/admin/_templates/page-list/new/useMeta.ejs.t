---
to: src/app/admin/dashboard/<%= name %>/provider/hooks/useMeta.ts
---

import { useCoCRouter } from '@hooks';
import { GroupButton } from '@kimjwally/ui';
import { useHandlers } from './useHandlers';

export const useMeta = (handlers: ReturnType<typeof useHandlers>) => {
  const { getUrlWithParams } = useCoCRouter();

  const leftButtons: GroupButton[] = [
    {
      children: '생성',
      color: 'primary',
      href: getUrlWithParams('/admin/dashboard/<%= name %>/:<%= h.inflection.singularize(name) %>Id/edit', {
        <%= h.inflection.singularize(name) %>Id: 'new',
      }),
    },
  ];

  const rightButtons: GroupButton[] = [
    {
      children: '삭제',
      color: 'danger',
      href: getUrlWithParams('/admin/dashboard/<%= name %>/:<%= h.inflection.singularize(name) %>Id/edit', {
        <%= h.inflection.singularize(name) %>Id: 'new',
      }),
    },
  ];

  return {
    table: {
      ...handlers,
      leftButtons,
      rightButtons,
    },
  };
};
