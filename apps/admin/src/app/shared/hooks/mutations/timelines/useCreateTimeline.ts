import { useMutation } from '@apollo/client';
import { CREATE_TIMELINE, GET_TIMELINES } from '@gqls';
import { MutationOptions } from '@types';

export const useCreateTimeline = (options?: MutationOptions) => {
  return useMutation(CREATE_TIMELINE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_TIMELINES, 'Timeline'],
  });
};
