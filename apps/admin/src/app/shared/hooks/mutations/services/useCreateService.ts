import { useMutation } from '@apollo/client';
import { MutationOptions } from '@types';
import { CREATE_SERVICE } from '../../../gqls/mutations';

export const useCreateService = (options: MutationOptions) => {
  return useMutation(CREATE_SERVICE, {
    onCompleted: () => {
      options.onCompleted && options.onCompleted();
    },
  });
};
