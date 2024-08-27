import { ButtonProps } from '@nextui-org/react';
import { useColumns } from './useColumns';
import { useData } from './useData';
import { useState } from './useState';
import { useHandlers } from './useHandlers';
import { useContext } from './useContext';

export const useProps = () => {
  const state = useState();
  const data = useData();
  const context = useContext();
  const { onClickCreate, onClickRemove } = useHandlers({
    state,
    data,
    context,
  });

  const columns = useColumns();

  const leftButtons: ButtonProps[] = [
    {
      children: '생성',
      color: 'primary',
      onClick: onClickCreate,
    },
  ];

  const rightButtons: ButtonProps[] = [
    {
      children: '삭제',
      color: 'danger',
      onClick: onClickRemove,
    },
  ];

  return {
    leftButtons,
    rightButtons,
    state,
    columns,
    data: data.getSpacesByQuery.data.data,
  };
};
