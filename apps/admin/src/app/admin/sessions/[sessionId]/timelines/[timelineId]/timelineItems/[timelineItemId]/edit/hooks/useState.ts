import { TimelineItemForm } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';
import { useParams } from 'next/navigation';

export const useState = ({
  queries,
}: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { timelineItemFormQuery } = queries;
  const timelineItemForm = timelineItemFormQuery?.data?.timelineItemForm;

  const formState = useLocalObservable<TimelineItemForm>(() => ({
    ...timelineItemForm,
    sessionId,
  }));

  return { form: formState };
};
