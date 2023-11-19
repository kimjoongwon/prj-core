import { GetRoleQueryVariables } from '@__generated__/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client';
import { GET_ROLE } from '@gqls';

export const useRoleQuery = (variables: GetRoleQueryVariables) => {
  return useSuspenseQuery(
    GET_ROLE,
    variables.id === 'new' ? skipToken : { variables },
  );
};
