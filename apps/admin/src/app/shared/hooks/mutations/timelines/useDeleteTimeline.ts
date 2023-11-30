import { useMutation } from '@apollo/client';
import { DELETE_TIMELINE, GET_TIMELINES } from '@gqls';
import { MutationOptions } from '@types';

export const useDeleteTimeline = (options?: MutationOptions) => {
  return useMutation(DELETE_TIMELINE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_TIMELINES, 'Timeline'],
  });
};
