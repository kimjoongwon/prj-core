import { useRemoveTimelineItems } from '../../../../apis';

export const useMutations = () => {
  return {
    removeTimelineItems: useRemoveTimelineItems(),
  };
};
