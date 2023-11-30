import { GetTimelinesQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { GET_TIMELINES } from '@gqls';

export const useTimelinesQuery = (variables: GetTimelinesQueryVariables) => {
  return useSuspenseQuery(GET_TIMELINES, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};