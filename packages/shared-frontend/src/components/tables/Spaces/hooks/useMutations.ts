import { useRemoveSpaces } from '../../../../apis';

export const useMutations = () => {
  return {
    removeSpaces: useRemoveSpaces(),
  };
};
