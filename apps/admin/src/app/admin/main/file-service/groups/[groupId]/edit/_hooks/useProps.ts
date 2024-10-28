import { useHandlers } from './useHandlers';
import { useContext } from './useContext';
import { useState } from './useState';
import { useData } from './useData';

export const useProps = () => {
  const context = useContext();
  const data = useData({ context });
  const state = useState({ context, data });
  const { onClickList, onClickSave } = useHandlers({ state, context, data });

  return {
    state,
    onClickList,
    onClickSave,
  };
};
