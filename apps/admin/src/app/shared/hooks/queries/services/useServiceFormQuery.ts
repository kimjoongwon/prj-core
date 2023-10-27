import { GetServiceFormQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_SERVICE_FORM } from '@gqls';

export const useServiceFormQuery = (variables: GetServiceFormQueryVariables) => {
  return useSuspenseQuery(GET_SERVICE_FORM, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
