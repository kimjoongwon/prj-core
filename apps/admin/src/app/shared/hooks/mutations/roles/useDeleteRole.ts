import { useMutation } from '@apollo/client';
import { DELETE_ROLE, GET_ROLES } from '@gqls';
import { MutationOptions } from '@types';

export const useDeleteRole = (options?: MutationOptions) => {
  return useMutation(DELETE_ROLE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_ROLES, 'Role'],
  });
};
