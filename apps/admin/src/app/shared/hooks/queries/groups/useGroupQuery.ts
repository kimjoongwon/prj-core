import { GetGroupQueryVariables } from '@__generated__/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client';
import { GET_GROUP } from '@gqls';

export const useGroupQuery = (variables: GetGroupQueryVariables) => {
  return useSuspenseQuery(
    GET_GROUP,
    variables.id === 'new' ? skipToken : { variables },
  );
};
