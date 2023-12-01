import { TimelineItemForm } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useState = ({
  queries,
}: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { timelineItemFormQuery } = queries;
  const timelineItemForm = timelineItemFormQuery?.data?.timelineItemForm;

  const formState = useLocalObservable<TimelineItemForm>(() => timelineItemForm);
  return { form: formState };
};
