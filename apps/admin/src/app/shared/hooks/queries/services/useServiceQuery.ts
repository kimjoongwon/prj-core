import { GetServiceQueryVariables } from '@__generated__/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client';
import { GET_SERVICE } from '@gqls';

export const useServiceQuery = (variables: GetServiceQueryVariables) => {
  return useSuspenseQuery(
    GET_SERVICE,
    variables.id === 'new' ? skipToken : { variables },
  );
};
