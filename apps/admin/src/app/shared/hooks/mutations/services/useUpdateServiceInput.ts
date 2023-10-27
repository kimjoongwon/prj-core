import { useMutation } from '@apollo/client';
import { UPDATE_SERVICE } from '@gqls';
import { MutationOptions } from '@types';

export const useUpdateService = (options: MutationOptions) => {
  return useMutation(UPDATE_SERVICE, {
    onCompleted: () => {
      options.onCompleted && options.onCompleted();
    },
  });
};
