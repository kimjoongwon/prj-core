import { GetServicesQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { GET_SERVICES } from '@gqls';

export const useServicesQuery = (variables: GetServicesQueryVariables) => {
  return useSuspenseQuery(GET_SERVICES, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
