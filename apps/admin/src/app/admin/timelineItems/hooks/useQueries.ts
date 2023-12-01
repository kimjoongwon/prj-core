import { useTimelineItemsQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  return {
    timelineItemsQuery: useTimelineItemsQuery(state.query),
  };
};
