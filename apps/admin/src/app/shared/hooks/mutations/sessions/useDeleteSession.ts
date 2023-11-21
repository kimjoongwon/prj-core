import { useMutation } from '@apollo/client';
import { DELETE_SESSION, GET_SESSIONS } from '@gqls';
import { MutationOptions } from '@types';

export const useDeleteSession = (options?: MutationOptions) => {
  return useMutation(DELETE_SESSION, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_SESSIONS, 'Session'],
  });
};
