import { useCoCRouter } from '@hooks';
import { GroupButton } from '@coc/ui';
import { useHandlers } from './useHandlers';

export const useMeta = (handlers: ReturnType<typeof useHandlers>) => {
  const { getUrlWithParams } = useCoCRouter();

  const leftButtons: GroupButton[] = [
    {
      children: '생성',
      color: 'primary',
      href: getUrlWithParams('/admin/dashboard/users/:userId/edit', {
        userId: 'new',
      }),
    },
  ];

  const rightButtons: GroupButton[] = [
    {
      children: '삭제',
      color: 'danger',
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
