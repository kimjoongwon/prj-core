import {
  useCreateTimelineItem,
  useGetTimelineItem,
  useUpdateTimelineItem,
} from '@shared/frontend';
import { useContext } from './useContext';

export const useData = (props: { context: ReturnType<typeof useContext> }) => {
  const {
    context: {
      params: { timelineItemId },
      isEditMode,
    },
  } = props;

  const getTimelineItem = useGetTimelineItem(timelineItemId, {
    query: {
      enabled: isEditMode,
    },
  });

  return {
    getTimelineItem: getTimelineItem,
    createTimelineItem: useCreateTimelineItem(),
    updateTimelineItem: useUpdateTimelineItem(),
  };
};
