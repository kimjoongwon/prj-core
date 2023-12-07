import { GetSpacesQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { GET_SPACES } from '@gqls';

export const useSpacesQuery = (variables: GetSpacesQueryVariables) => {
  return useSuspenseQuery(GET_SPACES, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
