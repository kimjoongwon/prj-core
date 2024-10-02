import { useRemoveService, useUpdateService } from '../../../../apis';

export const useMutations = () => {
  return {
    removeService: useRemoveService(),
  };
};
