import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_SERVICE_FORM } from '@gqls';

export const useServiceFormQuery = () => {
  return useSuspenseQuery(GET_SERVICE_FORM, {
    fetchPolicy: 'cache-and-network',
  });
};
