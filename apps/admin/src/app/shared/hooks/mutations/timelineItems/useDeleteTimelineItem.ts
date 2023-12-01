import { useMutation } from '@apollo/client';
import { DELETE_TIMELINEITEM, GET_TIMELINE_ITEMS } from '@gqls';
import { MutationOptions } from '@types';

export const useDeleteTimelineItem = (options?: MutationOptions) => {
  return useMutation(DELETE_TIMELINEITEM, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_TIMELINE_ITEMS, 'TimelineItem'],
  });
};
