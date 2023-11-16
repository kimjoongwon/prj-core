import { GetGroupFormQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_GROUP_FORM } from '@gqls';

export const useGroupFormQuery = (variables: GetGroupFormQueryVariables) => {
  return useSuspenseQuery(GET_GROUP_FORM, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
