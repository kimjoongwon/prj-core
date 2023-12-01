import { useMutation } from '@apollo/client';
import { CREATE_TIMELINEITEM, GET_TIMELINE_ITEMS } from '@gqls';
import { MutationOptions } from '@types';

export const useCreateTimelineItem = (options?: MutationOptions) => {
  return useMutation(CREATE_TIMELINEITEM, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_TIMELINE_ITEMS, 'TimelineItem'],
  });
};
