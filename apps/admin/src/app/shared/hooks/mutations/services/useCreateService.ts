import { useMutation } from '@apollo/client';
import { CREATE_SERVICE, GET_SERVICES } from '@gqls';
import { MutationOptions } from '@types';

export const useCreateService = (options?: MutationOptions) => {
  return useMutation(CREATE_SERVICE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_SERVICES, 'Service'],
  });
};
