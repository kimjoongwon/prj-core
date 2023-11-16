import {
  useCoCRouter,
  useCreateSpace,
  useUpdateSpace,
} from '@hooks';

export const useMutations = () => {
  const router = useCoCRouter();
  return {
    createSpace: useCreateSpace({
      onCompleted: () => {
        router.back();
      },
    }),
    updateSpace: useUpdateSpace({
      onCompleted: () => {
        router.back();
      },
    }),
  };
};
