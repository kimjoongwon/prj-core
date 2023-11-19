import { useMutation } from '@apollo/client';
import { REMOVE_ROLE, GET_ROLES } from '@gqls';
import { MutationOptions } from '@types';

export const useRemoveRole = (options?: MutationOptions) => {
  return useMutation(REMOVE_ROLE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_ROLES, 'Role'],
  });
};
