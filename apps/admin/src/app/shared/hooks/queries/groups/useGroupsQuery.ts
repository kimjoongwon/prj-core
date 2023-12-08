import { GetGroupsQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { GET_GROUPS } from '@gqls';

export const useGroupsQuery = (variables: GetGroupsQueryVariables) => {
  return useSuspenseQuery(GET_GROUPS, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
