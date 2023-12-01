import {
  useCoCRouter,
  useCreateTimelineItem,
  useUpdateTimelineItem,
} from '@hooks';

export const useMutations = () => {
  const router = useCoCRouter();
  return {
    createTimelineItem: useCreateTimelineItem({
      onCompleted: () => {
        router.back();
      },
    }),
    updateTimelineItem: useUpdateTimelineItem({
      onCompleted: () => {
        router.back();
      },
    }),
  };
};
