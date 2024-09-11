import { useRemoveSessions } from '../../../../apis';

export const useMutations = () => {
  return {
    removeSessions: useRemoveSessions(),
  };
};
