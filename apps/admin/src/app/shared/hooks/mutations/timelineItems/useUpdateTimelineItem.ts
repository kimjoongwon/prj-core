import { useMutation } from '@apollo/client';
import { UPDATE_TIMELINEITEM, GET_TIMELINE_ITEMS } from '@gqls';
import { MutationOptions } from '@types';

export const useUpdateTimelineItem = (options?: MutationOptions) => {
  return useMutation(UPDATE_TIMELINEITEM, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_TIMELINE_ITEMS, 'TimelineItem'],
  });
};

