import { useCoCRouter } from '@hooks';
import { GroupButton } from '@kimjwally/ui';
import { useHandlers } from './useHandlers';

export const useMeta = (handlers: ReturnType<typeof useHandlers>) => {
  const { getUrlWithParams } = useCoCRouter();

  const leftButtons: GroupButton[] = [
    {
      children: '생성',
      color: 'primary',
      href: getUrlWithParams('/admin/dashboard/workspaces/:workspaceId/edit', {
        workspaceId: 'new',
      }),
    },
  ];

  const rightButtons: GroupButton[] = [
    {
      children: '삭제',
      color: 'danger',
      href: getUrlWithParams('/admin/dashboard/workspaces/:workspaceId/edit', {
        workspaceId: 'new',
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
