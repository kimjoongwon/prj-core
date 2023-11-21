import { GetSessionFormQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_SESSION_FORM } from '@gqls';

export const useSessionFormQuery = (
  variables: GetSessionFormQueryVariables,
) => {
  return useSuspenseQuery(GET_SESSION_FORM, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
