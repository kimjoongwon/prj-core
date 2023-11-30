import {
  useCoCRouter,
  useCreateTimeline,
  useUpdateTimeline,
} from '@hooks';

export const useMutations = () => {
  const router = useCoCRouter();
  return {
    createTimeline: useCreateTimeline({
      onCompleted: () => {
        router.back();
      },
    }),
    updateTimeline: useUpdateTimeline({
      onCompleted: () => {
        router.back();
      },
    }),
  };
};
