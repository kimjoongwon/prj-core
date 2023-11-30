import { TimelineForm } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useState = ({
  queries,
}: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { timelineFormQuery } = queries;
  const timelineForm = timelineFormQuery?.data?.timelineForm;

  const formState = useLocalObservable<TimelineForm>(() => timelineForm);
  return { form: formState };
};
