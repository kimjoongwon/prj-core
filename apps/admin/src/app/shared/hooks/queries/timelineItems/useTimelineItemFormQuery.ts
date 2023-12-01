import { GetTimelineItemFormQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_TIMELINE_ITEM_FORM } from '@gqls';

export const useTimelineItemFormQuery = (
  variables: GetTimelineItemFormQueryVariables,
) => {
  return useSuspenseQuery(GET_TIMELINE_ITEM_FORM, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
