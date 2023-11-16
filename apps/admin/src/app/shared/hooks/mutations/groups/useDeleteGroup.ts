import { useMutation } from '@apollo/client';
import { DELETE_GROUP, GET_GROUPS } from '@gqls';
import { MutationOptions } from '@types';

export const useDeleteGroup = (options?: MutationOptions) => {
  return useMutation(DELETE_GROUP, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_GROUPS, 'Group'],
  });
};
