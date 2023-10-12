import { GectUserFormQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_USER_FORM } from '@gqls';

export const useUserFormQuery = (variables: GectUserFormQueryVariables) => {
  return useSuspenseQuery(GET_USER_FORM, {
    variables,
  });
};
