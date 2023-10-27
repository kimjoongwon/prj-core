import { useMutation } from '@apollo/client';
import { CREATE_SERVICE } from '@gqls';
import { MutationOptions } from '@types';

export const useDeleteServiceInput = (options: MutationOptions) => {
  return useMutation(CREATE_SERVICE, {
    onCompleted: () => {
      options.onCompleted && options.onCompleted();
    },
  });
};
