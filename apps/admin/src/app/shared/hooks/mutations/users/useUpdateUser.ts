import { MutationUpdateUserArgs } from '@__generated__/graphql';
import { useMutation } from '@apollo/client';
import { MutationOptions } from '../../../types/hooks/types';
import { UPDATE_USER } from '@gqls';

export const useUpdateUser = (options?: MutationOptions) => {
  return useMutation(UPDATE_USER, {
    onCompleted: () => {
      options?.onCompleted && options.onCompleted();
    },
  });
};
