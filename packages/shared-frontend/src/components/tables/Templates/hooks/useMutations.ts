import { useRemoveTemplates } from '../../../../apis';

export const useMutations = () => {
  return {
    removeTemplates: useRemoveTemplates(),
  };
};
