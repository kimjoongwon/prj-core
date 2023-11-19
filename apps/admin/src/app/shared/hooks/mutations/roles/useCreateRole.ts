import { useMutation } from '@apollo/client';
import { CREATE_ROLE, GET_ROLES } from '@gqls';
import { MutationOptions } from '@types';

export const useCreateRole = (options?: MutationOptions) => {
  return useMutation(CREATE_ROLE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_ROLES, 'Role'],
  });
};
