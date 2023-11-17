import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_SPACE_FORM } from '@gqls';

export const useSpaceFormQuery = (variables: GetSpaceFormQueryVariables) => {
  return useSuspenseQuery(GET_SPACE_FORM, {
    fetchPolicy: 'cache-and-network',
  });
};


