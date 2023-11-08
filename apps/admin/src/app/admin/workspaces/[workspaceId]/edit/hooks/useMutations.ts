import {
  useCoCRouter,
  useCreateWorkspace,
  useUpdateWorkspace,
} from '@hooks';

export const useMutations = () => {
  const router = useCoCRouter();
  return {
    createWorkspace: useCreateWorkspace({
      onCompleted: () => {
        router.back();
      },
    }),
    updateWorkspace: useUpdateWorkspace({
      onCompleted: () => {
        router.back();
      },
    }),
  };
};
