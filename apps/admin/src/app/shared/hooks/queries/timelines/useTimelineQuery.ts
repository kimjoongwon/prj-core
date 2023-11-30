import { GetTimelineQueryVariables } from '@__generated__/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client';
import { GET_TIMELINE } from '@gqls';

export const useTimelineQuery = (variables: GetTimelineQueryVariables) => {
  return useSuspenseQuery(
    GET_TIMELINE,
    variables.id === 'new' ? skipToken : { variables },
  );
};
