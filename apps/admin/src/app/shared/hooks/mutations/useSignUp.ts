import { SignUpMutationVariables } from '@__generated__/graphql';
import { useMutation } from '@apollo/client';
import { GET_USERS, SIGN_UP } from '@gqls';
import { useCoCRouter } from '@hooks';

export const useSignUp = (variables: SignUpMutationVariables) => {
  const router = useCoCRouter();
  return useMutation(SIGN_UP, {
    variables,
    refetchQueries: [GET_USERS, 'GetUsers'],
    onCompleted: () =>
      router.push({
        url: '/admin/dashboard/users',
      }),
  });
};
