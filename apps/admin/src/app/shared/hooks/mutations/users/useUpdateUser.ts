import { MutationUpdateUserArgs } from '@__generated__/graphql';
import { useMutation } from '@apollo/client';
import { MutationOptions } from '../../../types/hooks/types';
import { UPDATE_USER } from '@gqls';

export const useUpdateUser = (
  args: MutationUpdateUserArgs,
  options: MutationOptions,
) => {
  return useMutation(UPDATE_USER, {
    variables: args,
    onCompleted: () => {
      options.onCompleted && options.onCompleted();
    },
  });
};
