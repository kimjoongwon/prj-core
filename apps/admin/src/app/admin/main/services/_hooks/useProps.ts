import { ButtonProps } from '@nextui-org/react';
import { useColumns } from './useColumns';
import { useData } from './useData';
import { useState } from './useState';
import { galaxy } from '@shared/frontend';

export const useProps = () => {
  const state = useState();
  const {
    removeServices,
    getAllService: { data: getAllServiceData },
  } = useData();

  const columns = useColumns();

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
        await removeServices.mutateAsync({
          serviceIds: state.selection.toString(),
        });
      },
    },
  ];

  return {
    leftButtons,
    rightButtons,
    state,
    columns,
    data: getAllServiceData.data,
  };
};
