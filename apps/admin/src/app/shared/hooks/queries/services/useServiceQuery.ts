import { GetServiceQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { GET_SERVICE } from '@gqls';

export const useServiceQuery = (variables: GetServiceQueryVariables) => {
  return useSuspenseQuery(GET_SERVICE, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
