import { useLocalObservable } from 'mobx-react-lite';
import { TimelineForm } from '@__generated__/graphql';
import { useQueries } from './useQueries';

export const useState = ({
  queries,
}: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { timelineFormQuery } = queries;
  const state = useLocalObservable<{
    form: TimelineForm;
    selectedTimelineItemIds: string[];
  }>(() => ({
    form: timelineFormQuery.data.timelineForm as TimelineForm,
    selectedTimelineItemIds: [],
  }));

  return state;
};
