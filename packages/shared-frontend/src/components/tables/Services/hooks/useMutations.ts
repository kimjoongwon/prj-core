import { useRemoveService } from '../../../../apis';

export const useMutations = () => {
  return {
    removeService: useRemoveService(),
  };
};
