import { useMutation } from '@apollo/client';
import { CREATE_GROUP, GET_GROUPS } from '@gqls';
import { MutationOptions } from '@types';

export const useCreateGroup = (options?: MutationOptions) => {
  return useMutation(CREATE_GROUP, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_GROUPS, 'Group'],
  });
};
