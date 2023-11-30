import { useMutation } from '@apollo/client';
import { UPDATE_TIMELINE, GET_TIMELINES } from '@gqls';
import { MutationOptions } from '@types';

export const useUpdateTimeline = (options?: MutationOptions) => {
  return useMutation(UPDATE_TIMELINE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_TIMELINES, 'Timeline'],
  });
};

