import { GetTimelineItemQueryVariables } from '@__generated__/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client';
import { GET_TIMELINE_ITEM } from '@gqls';

export const useTimelineItemQuery = (variables: GetTimelineItemQueryVariables) => {
  return useSuspenseQuery(
    GET_TIMELINE_ITEM,
    variables.id === 'new' ? skipToken : { variables },
  );
};
