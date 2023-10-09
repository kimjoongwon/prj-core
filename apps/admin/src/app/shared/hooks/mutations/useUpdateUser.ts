import { MutationUpdateUserArgs } from '@__generated__/graphql';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../../gqls/mutations';

export const useUpdateUser = (args: MutationUpdateUserArgs) => {
  return useMutation(UPDATE_USER, {
    variables: args,
  });
};
