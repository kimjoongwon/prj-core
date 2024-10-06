import { ButtonProps } from '@nextui-org/react';
import { useColumns } from './useColumns';
import { useState } from './useState';
import { galaxy } from '../../../../providers/App';
import { useParams } from 'next/navigation';

export const useProps = () => {
  const state = useState();
  const { serviceId } = useParams<{ serviceId: string }>();
  const columns = useColumns();

  const leftButtons: ButtonProps[] = [
    {
      children: '생성',
      color: 'primary',
      onClick: () => {
        galaxy.router.push({
          url: '/admin/main/app/services/:serviceId/categories/:categoryId/edit',
          params: {
            serviceId,
            categoryId: 'new',
          },
        });
      },
    },
  ];

  const rightButtons: ButtonProps[] = [
    {
      children: '삭제',
      color: 'danger',
      onClick: async () => {},
    },
  ];

  return {
    leftButtons,
    rightButtons,
    state,
    columns,
  };
};
