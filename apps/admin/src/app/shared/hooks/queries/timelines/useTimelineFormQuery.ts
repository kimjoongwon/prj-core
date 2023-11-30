import { GetTimelineFormQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_TIMELINE_FORM } from '@gqls';

export const useTimelineFormQuery = (
  variables: GetTimelineFormQueryVariables,
) => {
  return useSuspenseQuery(GET_TIMELINE_FORM, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
