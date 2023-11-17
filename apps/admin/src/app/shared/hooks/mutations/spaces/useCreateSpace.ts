import { useMutation } from '@apollo/client';
import { CREATE_SPACE, GET_SPACES } from '@gqls';
import { MutationOptions } from '@types';

export const useCreateSpace = (options?: MutationOptions) => {
  return useMutation(CREATE_SPACE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_SPACES, 'Space'],
  });
};
