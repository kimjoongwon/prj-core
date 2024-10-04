import { ButtonProps } from '@nextui-org/react';
import { useColumns } from './useColumns';
import { useState } from './useState';
import { galaxy } from '../../../../providers/App';
import { useMutations } from './useMutations';
import { useHandlers } from './useHandlers';
export const useProps = () => {
  const state = useState();
  const { removeService } = useMutations();
  const columns = useColumns();
  const { onClickRow } = useHandlers({ state });

  const leftButtons: ButtonProps[] = [
    {
      children: '생성',
      color: 'primary',
      onClick: () => {
        galaxy.router.push({
          url: '/admin/main/services/:serviceId/edit',
          params: {
            serviceId: 'new',
          },
        });
      },
    },
  ];

  const rightButtons: ButtonProps[] = [
    {
      children: '삭제',
      color: 'danger',
      onClick: async () => {
        await removeService.mutateAsync({
          serviceId: state.selectedKeys?.[0],
        });
      },
    },
  ];

  return {
    leftButtons,
    rightButtons,
    state,
    columns,
  };
};
