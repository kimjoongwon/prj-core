import { useCoCRouter } from '@hooks';
import { GroupButton } from '@coc/ui';
import { useHandlers } from './useHandlers';
import { WORKSPACE_EDIT_PATH } from '../../../../../shared/constants/paths';

export const useMeta = (handlers: ReturnType<typeof useHandlers>) => {
  const { getUrlWithParams } = useCoCRouter();

  const leftButtons: GroupButton[] = [
    {
      children: '생성',
      color: 'primary',
      href: getUrlWithParams(WORKSPACE_EDIT_PATH, {
        workspaceId: 'new',
      }),
    },
  ];

  const rightButtons: GroupButton[] = [
    {
      children: '삭제',
      color: 'danger',
      href: getUrlWithParams(WORKSPACE_EDIT_PATH, {
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
