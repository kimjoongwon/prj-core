import { GetSessionQueryVariables } from '@__generated__/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client';
import { GET_SESSION } from '@gqls';

export const useSessionQuery = (variables: GetSessionQueryVariables) => {
  return useSuspenseQuery(
    GET_SESSION,
    variables.id === 'new' ? skipToken : { variables },
  );
};
