import { useMutation } from '@apollo/client';
import { UPDATE_SESSION, GET_SESSIONS } from '@gqls';
import { MutationOptions } from '@types';

export const useUpdateSession = (options?: MutationOptions) => {
  return useMutation(UPDATE_SESSION, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_SESSIONS, 'Session'],
  });
};
