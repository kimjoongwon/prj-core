import { ButtonProps } from '@nextui-org/react';
import { useQueries } from './useQueries';
import { useHandlers } from './useHandlers';
import { useState } from './useState';
import { useMutations } from './useMutataions';

export const useSessionEditPage = () => {
  const queries = useQueries();
  const mutations = useMutations();

  const state = useState({
    queries,
  });

  const { onClickList, onClickSave } = useHandlers({
    mutations,
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
