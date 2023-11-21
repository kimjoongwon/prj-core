import { useMutation } from '@apollo/client';
import { CREATE_SESSION, GET_SESSIONS } from '@gqls';
import { MutationOptions } from '@types';

export const useCreateSession = (options?: MutationOptions) => {
  return useMutation(CREATE_SESSION, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_SESSIONS, 'Session'],
  });
};
