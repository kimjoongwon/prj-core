import { useHandlers } from './useHandlers';
import { useStates } from './useStates';

export const useMeta = (
  context: ReturnType<typeof useStates> & ReturnType<typeof useHandlers>,
) => {
  const { formState, onClickCancel, onClickSave } = context;
  return {
    form: {
      state: formState,
      buttons: {
        onClickSave,
        onClickCancel,
      },
    },
  };
};
