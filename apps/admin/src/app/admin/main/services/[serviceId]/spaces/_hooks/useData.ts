import { useGetSpacesByQuerySuspense, useRemoveSpaces } from '@shared/frontend';

export const useData = () => {
  return {
    getSpacesByQuery: useGetSpacesByQuerySuspense(),
    removeSpaces: useRemoveSpaces(),
  };
};
