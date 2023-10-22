import { useHandlers } from './useHandlers';
import { useSchema } from './useSchema';

export const useMeta = (context: ReturnType<typeof useHandlers>) => {
  const { onClickCancel, onClickSave } = context;

  return {
    form: {
      schema: useSchema(),
    },
    formActions: {
      onClickCancel,
      onClickSave,
    },
  };
};
