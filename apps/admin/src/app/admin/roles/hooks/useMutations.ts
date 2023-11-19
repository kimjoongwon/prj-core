import { useCoCRouter, useRemoveRole } from '@hooks';

export const useMutations = () => {
  const router = useCoCRouter();
  return {
    removeRole: useRemoveRole({
      onCompleted: () => {
        router.back();
      },
    }),
  };
};
