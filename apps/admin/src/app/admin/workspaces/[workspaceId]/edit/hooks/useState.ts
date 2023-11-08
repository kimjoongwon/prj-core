import { WorkspaceForm } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useState = ({
  queries,
}: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { workspaceFormQuery } = queries;
  const workspaceForm = workspaceFormQuery?.data?.workspaceForm;

  const formState = useLocalObservable<WorkspaceForm>(() => workspaceForm);
  return { form: formState };
};
