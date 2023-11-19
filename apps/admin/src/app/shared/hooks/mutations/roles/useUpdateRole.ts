import { useMutation } from '@apollo/client';
import { UPDATE_ROLE, GET_ROLES } from '@gqls';
import { MutationOptions } from '@types';

export const useUpdateRole = (options?: MutationOptions) => {
  return useMutation(UPDATE_ROLE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_ROLES, 'Role'],
  });
};

