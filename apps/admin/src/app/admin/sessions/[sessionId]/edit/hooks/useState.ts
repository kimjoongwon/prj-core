import { SessionForm } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useState = ({
  queries,
}: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { sessionFormQuery } = queries;
  const sessionForm = sessionFormQuery?.data?.sessionForm;

  const formState = useLocalObservable<SessionForm>(() => {
    const sessionForm: SessionForm = {
      endDateTime: undefined,
      name: '',
      startDateTime: undefined,
      tenantId: '',
    };

    return sessionForm;
  });
  return { form: formState };
};
