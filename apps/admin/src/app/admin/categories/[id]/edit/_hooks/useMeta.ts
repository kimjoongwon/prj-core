import { useHandlers } from './useHandlers';
import { useSchema } from './useSchema';
import { useMutations } from './useMutations';
import { useQueries } from './useQueries';
import { useStates } from './useStates';

export const useMeta = () => {
  const queries = useQueries();
  const states = useStates(queries);
  const mutations = useMutations(states);
  const { onClickCancel, onClickSave } = useHandlers(mutations);
  const { formState } = states;

  return {
    form: {
      state: formState,
      onClickCancel,
      onClickSave,
      schema: useSchema(),
    },
  };
};
