import { ButtonProps } from '@nextui-org/react';
import { useContext } from './useContext';
import { useData } from './useData';
import { useHandlers } from './useHandlers';
import { useState } from './useState';

export const useProps = () => {
  const context = useContext();
  const data = useData({
    context,
  });
  const state = useState({
    context,
    data,
  });

  const { onClickList, onClickSave } = useHandlers({
    context,
    data,
    state,
  });

  const leftButtons: ButtonProps[] = [
    {
      children: '목록',
      onClick: onClickList,
      variant: 'bordered',
    },
  ];

  const rightButtons: ButtonProps[] = [
    {
      children: '저장',
      onClick: onClickSave,
      color: 'primary',
    },
  ];

  return {
    state,
    leftButtons,
    rightButtons,
  };
};
