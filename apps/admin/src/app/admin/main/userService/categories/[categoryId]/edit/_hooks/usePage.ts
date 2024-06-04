import { ButtonProps } from '@nextui-org/react';
import { useContext } from './useContext';
import { useQueries } from './useQueries';
import { useState } from './useState';
import { useHandlers } from './useHandlers';

export const usePage = () => {
  const context = useContext();

  const queries = useQueries({ context });

  const state = useState(queries);

  const { onClickCancel, onClickSave } = useHandlers({
    context,
    queries,
    state,
  });

  const leftButtons: ButtonProps[] = [
    {
      onClick: onClickCancel,
      children: '취소',
    },
  ];

  const rightButtons: ButtonProps[] = [
    {
      children: '저장',
      onClick: onClickSave,
    },
  ];

  return {
    state,
    meta: {
      form: {
        leftButtons,
        rightButtons,
      },
    },
  };
};
