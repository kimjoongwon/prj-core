import { useMutation } from '@apollo/client';
import { UPDATE_GROUP, GET_GROUPS } from '@gqls';
import { MutationOptions } from '@types';

export const useUpdateGroup = (options?: MutationOptions) => {
  return useMutation(UPDATE_GROUP, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_GROUPS, 'Group'],
  });
};

