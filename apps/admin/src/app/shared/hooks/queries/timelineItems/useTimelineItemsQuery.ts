import { GetTimelineItemsQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { GET_TIMELINE_ITEMS } from '@gqls';

export const useTimelineItemsQuery = (
  variables: GetTimelineItemsQueryVariables,
) => {
  return useSuspenseQuery(GET_TIMELINE_ITEMS, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
