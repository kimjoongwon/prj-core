import { useMutation } from '@apollo/client';
import { GET_SERVICES } from '@gqls';
import { MutationOptions } from '@types';
import { CREATE_SERVICE } from '../../../gqls/mutations';

export const useCreateService = (options: MutationOptions) => {
  return useMutation(CREATE_SERVICE, {
    onCompleted: () => {
      options.onCompleted && options.onCompleted();
    },
    refetchQueries: [GET_SERVICES, 'Service'],
  });
};
