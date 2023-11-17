import { useMutation } from '@apollo/client';
import { UPDATE_SPACE, GET_SPACES } from '@gqls';
import { MutationOptions } from '@types';

export const useUpdateSpace = (options?: MutationOptions) => {
  return useMutation(UPDATE_SPACE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_SPACES, 'Space'],
  });
};

