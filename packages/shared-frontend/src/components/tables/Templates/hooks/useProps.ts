import { ButtonProps } from '@nextui-org/react';
import { useColumns } from './useColumns';
import { useState } from './useState';
import { useHandlers } from './useHandlers';
import { useContext } from './useContext';
import { useMutations } from './useMutations';

export const useProps = () => {
  const state = useState();
  const context = useContext();
  const data = useMutations();

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
  };
};
