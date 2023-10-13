import { useHandlers } from './useHandlers';

export const useMeta = (context: ReturnType<typeof useHandlers>) => {
  return {
    ...context,
  };
};
