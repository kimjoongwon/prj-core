import { useMutation } from '@apollo/client';
import { DELETE_SPACE, GET_SPACES } from '@gqls';
import { MutationOptions } from '@types';

export const useDeleteSpace = (options?: MutationOptions) => {
  return useMutation(DELETE_SPACE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_SPACES, 'Space'],
  });
};
