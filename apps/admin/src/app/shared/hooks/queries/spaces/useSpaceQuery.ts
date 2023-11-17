import { GetSpaceQueryVariables } from '@__generated__/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client';
import { GET_SPACE } from '@gqls';

export const useSpaceQuery = (variables: GetSpaceQueryVariables) => {
  return useSuspenseQuery(
    GET_SPACE,
    variables.id === 'new' ? skipToken : { variables },
  );
};
